# randomization.py

import math
import random
import string

def generate_treatment_labels(num_treatments):
    """Generates treatment labels ('A', 'B', ..., up to 10)."""
    if num_treatments > 10:
        # Match the behavior of the TS code which implicitly caps at 10
        num_treatments = 10
    return list(string.ascii_uppercase[:num_treatments])

def shuffle_list(data_list):
    """Shuffles a list in place using Fisher-Yates (Knuth) algorithm."""
    random.shuffle(data_list) # random.shuffle uses Fisher-Yates
    return data_list

def generate_blocked_randomization(target_num_subjects, block_size, num_treatments):
    """
    Generates a blocked randomization sequence, adjusting the total allocation
    size upwards to the nearest multiple of the block size if necessary.

    Args:
        target_num_subjects: The desired target number of subjects (int).
        block_size: The desired number of subjects within each block (int).
                    Must be divisible by num_treatments.
        num_treatments: The number of treatment groups (int, 2-10).

    Returns:
        A dictionary containing the randomization sequence and details,
        or a dictionary with an error message.
    """

    # --- Input Validation ---
    if not (2 <= target_num_subjects <= 500):
        return {"sequence": [], "error": "Target Sample Size must be between 2 and 500."}
    if not (2 <= num_treatments <= 10):
        return {"sequence": [], "error": "Number of Treatments must be between 2 and 10."}
    if block_size <= 0:
        return {"sequence": [], "error": "Block Size must be a positive number."}
    if block_size < num_treatments:
         return {
             "sequence": [],
             "error": f"Block Size ({block_size}) must be greater than or equal to the number of treatments ({num_treatments})."
         }
    if block_size % num_treatments != 0:
        return {
            "sequence": [],
            "error": f"Block size ({block_size}) must be divisible by the number of treatments ({num_treatments}) to ensure equal allocation within blocks."
        }

    # --- Calculate Actual Allocation Size and Number of Blocks ---
    warning_message = None
    num_blocks = math.ceil(target_num_subjects / block_size)
    actual_allocation_size = num_blocks * block_size

    if actual_allocation_size != target_num_subjects:
        warning_message = f"Target sample size ({target_num_subjects}) is not a multiple of block size ({block_size}). Allocation generated for {actual_allocation_size} subjects."

    # --- Randomization Logic ---
    treatment_labels = generate_treatment_labels(num_treatments)
    assignments_per_treatment_per_block = block_size // num_treatments
    full_sequence = []
    overall_subject_index = 0

    for i in range(num_blocks):
        current_block_template = []
        for label in treatment_labels:
            current_block_template.extend([label] * assignments_per_treatment_per_block)

        shuffled_block = shuffle_list(current_block_template) # Shuffle the template

        for treatment in shuffled_block:
            full_sequence.append({
                "treatment": treatment,
                "blockIndex": i,  # 0-based block index
                "subjectIndex": overall_subject_index # 0-based overall subject index
            })
            overall_subject_index += 1

    # --- Return Success Result ---
    # Basic check for internal consistency (should always pass if logic is correct)
    if len(full_sequence) != actual_allocation_size:
         return {
             "sequence": [],
             "error": f"Internal error: Generated sequence length ({len(full_sequence)}) does not match calculated allocation size ({actual_allocation_size})."
         }

    success_result = {
        "sequence": full_sequence,
        "targetSampleSize": target_num_subjects,
        "actualAllocationSize": actual_allocation_size,
        "numBlocks": num_blocks,
        "blockSize": block_size,
        "numTreatments": num_treatments,
    }

    if warning_message:
        success_result["warning"] = warning_message

    return success_result

# --- Example Usage (Optional) ---
if __name__ == "__main__":
    target_subjects = 24
    block_s = 6
    num_treats = 3
    result = generate_blocked_randomization(target_subjects, block_s, num_treats)

    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Target Sample Size: {result['targetSampleSize']}")
        print(f"Actual Allocation Size: {result['actualAllocationSize']}")
        print(f"Number of Blocks: {result['numBlocks']}")
        print(f"Block Size: {result['blockSize']}")
        print(f"Number of Treatments: {result['numTreatments']}")
        if "warning" in result:
            print(f"Warning: {result['warning']}")

        print("\nGenerated Sequence:")
        # Pretty print sequence grouped by block
        current_block = -1
        for item in result['sequence']:
            if item['blockIndex'] != current_block:
                current_block = item['blockIndex']
                print(f"\n--- Block {current_block + 1} ---") # Display as 1-based block
            print(f"  Subject {item['subjectIndex'] + 1}: Treatment {item['treatment']}") # Display as 1-based subject index

    print("-" * 20)
    # Example with error
    result_err = generate_blocked_randomization(20, 5, 3)
    if "error" in result_err:
        print(f"Error Example: {result_err['error']}")

    print("-" * 20)
    # Example with warning
    result_warn = generate_blocked_randomization(25, 6, 3)
    if "warning" in result_warn:
        print(f"Warning Example: {result_warn['warning']}")
        # print(result_warn['sequence']) # Optionally print sequence