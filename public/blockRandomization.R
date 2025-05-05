# randomization.R

#' Generate Treatment Labels
#'
#' Generates treatment labels ('A', 'B', ..., up to 10).
#'
#' @param num_treatments The number of treatment groups (integer).
#' @return A character vector of labels.
generate_treatment_labels <- function(num_treatments) {
  count <- min(num_treatments, 10) # Match TS behavior capping at 10
  return(LETTERS[1:count])
}

#' Generate Blocked Randomization Sequence
#'
#' Generates a blocked randomization sequence, adjusting the total allocation
#' size upwards to the nearest multiple of the block size if necessary.
#'
#' @param target_num_subjects The desired target number of subjects (integer).
#' @param block_size The desired number of subjects within each block (integer).
#'                   Must be divisible by num_treatments.
#' @param num_treatments The number of treatment groups (integer, 2-10).
#'
#' @return A list containing the randomization sequence (as a data frame)
#'         and details, or a list with an error message.
generate_blocked_randomization <- function(target_num_subjects, block_size, num_treatments) {

  # --- Input Validation ---
  if (target_num_subjects < 2 || target_num_subjects > 500) {
    return(list(sequence = data.frame(), error = "Target Sample Size must be between 2 and 500."))
  }
  if (num_treatments < 2 || num_treatments > 10) {
    return(list(sequence = data.frame(), error = "Number of Treatments must be between 2 and 10."))
  }
  if (block_size <= 0) {
     return(list(sequence = data.frame(), error = "Block Size must be a positive number."))
  }
   if (block_size < num_treatments) {
    return(list(
        sequence = data.frame(),
        error = paste0("Block Size (", block_size, ") must be greater than or equal to the number of treatments (", num_treatments, ").")
    ))
  }
  # Use %% for modulo operator
  if (block_size %% num_treatments != 0) {
    return(list(
      sequence = data.frame(),
      error = paste0("Block size (", block_size, ") must be divisible by the number of treatments (", num_treatments, ") to ensure equal allocation within blocks.")
    ))
  }

  # --- Calculate Actual Allocation Size and Number of Blocks ---
  warning_message <- NULL
  # Use ceiling() for ceiling division equivalent
  num_blocks <- ceiling(target_num_subjects / block_size)
  actual_allocation_size <- num_blocks * block_size

  if (actual_allocation_size != target_num_subjects) {
      warning_message <- paste0("Target sample size (", target_num_subjects, ") is not a multiple of block size (", block_size, "). Allocation generated for ", actual_allocation_size, " subjects.")
  }

  # --- Randomization Logic ---
  treatment_labels <- generate_treatment_labels(num_treatments)
  assignments_per_treatment_per_block <- block_size / num_treatments # Use / for floating point division first
  assignments_per_treatment_per_block <- as.integer(assignments_per_treatment_per_block) # Ensure integer

  full_sequence_list <- list() # Use a list to build the sequence rows
  overall_subject_index <- 0 # Maintain 0-based index internally

  for (i in 0:(num_blocks - 1)) { # Loop from 0 to num_blocks-1 for 0-based blockIndex
    current_block_template <- c()
    for (label in treatment_labels) {
      # Use rep() to repeat elements
      current_block_template <- c(current_block_template, rep(label, assignments_per_treatment_per_block))
    }

    # Use sample() to shuffle the block template
    shuffled_block <- sample(current_block_template)

    for (treatment in shuffled_block) {
      # Append a list (representing a row) to the main list
      full_sequence_list[[length(full_sequence_list) + 1]] <- list(
        treatment = treatment,
        blockIndex = i,  # Store 0-based block index
        subjectIndex = overall_subject_index # Store 0-based overall subject index
      )
      overall_subject_index <- overall_subject_index + 1
    }
  }

  # --- Convert list of lists to a data frame ---
  # Using bind_rows is efficient if dplyr is available, otherwise use do.call with rbind
  # Base R approach:
   if (length(full_sequence_list) > 0) {
       full_sequence_df <- do.call(rbind, lapply(full_sequence_list, data.frame, stringsAsFactors = FALSE))
   } else {
       full_sequence_df <- data.frame(treatment=character(), blockIndex=integer(), subjectIndex=integer())
   }


  # --- Return Success Result ---
   # Basic check for internal consistency
   if (nrow(full_sequence_df) != actual_allocation_size) {
        return(list(
            sequence = data.frame(),
            error = paste0("Internal error: Generated sequence length (", nrow(full_sequence_df), ") does not match calculated allocation size (", actual_allocation_size, ").")
        ))
   }


  success_result <- list(
      sequence = full_sequence_df,
      targetSampleSize = target_num_subjects,
      actualAllocationSize = actual_allocation_size,
      numBlocks = num_blocks,
      blockSize = block_size,
      numTreatments = num_treatments
  )

  if (!is.null(warning_message)) {
      success_result$warning <- warning_message
  }

  return(success_result)
}

# --- Example Usage (Optional) ---
# Suppress package startup messages for cleaner example output if using dplyr/purrr later
# suppressPackageStartupMessages(library(dplyr)) # If using bind_rows

# Example 1: Standard case
target_subjects <- 24
block_s <- 6
num_treats <- 3
result <- generate_blocked_randomization(target_subjects, block_s, num_treats)

if (!is.null(result$error)) {
  cat("Error:", result$error, "\n")
} else {
  cat("Target Sample Size:", result$targetSampleSize, "\n")
  cat("Actual Allocation Size:", result$actualAllocationSize, "\n")
  cat("Number of Blocks:", result$numBlocks, "\n")
  cat("Block Size:", result$blockSize, "\n")
  cat("Number of Treatments:", result$numTreatments, "\n")
  if (!is.null(result$warning)) {
    cat("Warning:", result$warning, "\n")
  }

  cat("\nGenerated Sequence (Data Frame):\n")
  print(result$sequence)

  # Example of accessing/displaying grouped by block (using base R)
  cat("\nGenerated Sequence (Grouped by Block):\n")
  split_by_block <- split(result$sequence, result$sequence$blockIndex)
  for (block_idx_0based in names(split_by_block)) {
      block_num <- as.integer(block_idx_0based) + 1 # Display as 1-based block
      cat(paste0("\n--- Block ", block_num, " ---\n"))
      # Add 1 to subjectIndex for display purposes if desired
      block_data <- split_by_block[[block_idx_0based]]
      block_data$displaySubjectIndex <- block_data$subjectIndex + 1
      print(block_data[, c("displaySubjectIndex", "treatment")], row.names = FALSE)
  }
}

cat("--------------------\n")
# Example 2: Error case
result_err <- generate_blocked_randomization(20, 5, 3)
if (!is.null(result_err$error)) {
  cat("Error Example:", result_err$error, "\n")
}

cat("--------------------\n")
# Example 3: Warning case
result_warn <- generate_blocked_randomization(25, 6, 3)
if (!is.null(result_warn$warning)) {
    cat("Warning Example:", result_warn$warning, "\n")
    # print(result_warn$sequence) # Optionally print sequence
}