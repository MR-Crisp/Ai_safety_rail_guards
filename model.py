from sentence_transformers import SentenceTransformer, util


def similarity(context_text, user_text):
    context_vec = model.encode(context_text, normalize_embeddings=True)
    input_vec   = model.encode(user_text, normalize_embeddings=True)

    score = util.cos_sim(context_vec, input_vec)
    return score

def calculate_similarity(context_text, user_text):
    similarity_float = similarity(context_text, user_text).item()
    if similarity_float < 0.4:
        return False
    else:
        return True


similarity("AstraZeneca is a global biopharmaceutical company focused on the research, development, and commercialization of prescription medicines. The company specializes in key therapeutic areas including oncology, cardiovascular, renal and metabolic diseases, respiratory and immunology, and rare diseases. AstraZeneca operates worldwide and emphasizes science-driven innovation, clinical research, and partnerships to deliver treatments that improve patient outcomes and address unmet medical needs. It is also involved in vaccine development and biologics, with a strong commitment to sustainability, ethics, and global health initiatives."
                 ,"tell me the best python code to find apples")