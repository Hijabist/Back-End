# stylehijap.py

import sys
import json

class HijabStyleRecommendation:
    def __init__(self):
        # Database style hijab berdasarkan bentuk wajah
        self.hijab_styles = {
            "HEART": [
                "https://youtube.com/shorts/BB8LKsneCBM?si=bWdapxAtL_D8x2Lu",
                "https://youtube.com/shorts/FGH2mvZeY-E?si=XMtiZR2Gw1bVNDtJ",
                "https://youtube.com/shorts/zivP6a31ARE?si=JUnCXDFwUhLvyg_c",
                "https://youtube.com/shorts/TbN4TZRMdEI?si=dTAF2Byt5puleA3q",
                "https://youtu.be/tmiUhh0DxyQ?si=kBCs1IBtKx2NM-_D",
                "https://youtu.be/yumjQ6tQKSg?si=D3lOT8ssahra2TYw",
                "https://youtu.be/h9r_DGDTJj8?si=JoV9xczq2P7OqAay",
                "https://youtu.be/Jy9OCBD6MwA?si=rB1bAf8l_n9yvMZQ",
                "https://youtube.com/shorts/_nBmaSMlwPA?si=p_-jFEosEzVZU2DL",
                "https://youtube.com/shorts/Hkcz0De0Xig?si=nHGsSu3TwMG_jS7d"
            ],
            "OBLONG": [
                "https://youtube.com/shorts/aYGc00orKjY?si=a7O0D-JlQJX_-w4C",
                "https://youtube.com/shorts/eGHHGypx5gs?si=kFeVmqSfgcdxprbr",
                "https://youtube.com/shorts/DORjb69tTEg?si=QM-N5Bdn7F46AZs5",
                "https://youtube.com/shorts/SnC1u0F7Zt8?si=F-mTmPEYq-00gjYO",
                "https://youtube.com/shorts/xBJvgetJoB8?si=bdsZvfc89CG7Qp6_",
                "https://youtu.be/NGhbZim2Scc?si=byTGjih7w-jFv3cV",
                "https://youtube.com/shorts/ONUZsTxj_F8?si=wzmU-N22VCi_pCS6",
                "https://youtube.com/shorts/qxXJpKNfLWk?si=y43Rz0rKJ5GsrtHq",
                "https://youtu.be/zPTHuDH5fVE?si=_PO3dtMiBiugNIxm",
                "https://youtube.com/shorts/Egsd2N3XC2E?si=C-2k2YMPD5wOCxWw"
            ],
            "OVAL": [
                "https://youtube.com/shorts/fYEjsNLMuEQ?si=Me0QPNu7TcDnXd3t",
                "https://youtube.com/shorts/RXkdLu6A7hE?si=2cArRfH9ho_ufYL0",
                "https://youtube.com/shorts/mFrJkm8iDEI?si=rjaSIS6Pr5A0p5NW",
                "https://youtube.com/shorts/Lotday0l9SU?si=5cJen4Z8izG-GlWr",
                "https://youtube.com/shorts/eC99dWwpl4o?si=72GCqaPUJ7L5BT4E",
                "https://youtube.com/shorts/g6g30ydTIqw?si=Kfes2JWPz3JLovzW",
                "https://youtube.com/shorts/KN4JxN1ZUxo?si=9uKoj7Tq-vbd5k4W",
                "https://youtube.com/shorts/8ooagvJlTJI?si=IiQ0L4B_alrRsMty",
                "https://youtube.com/shorts/GCzZ_sbEeb0?si=taT4cn2WQjqNht20",
                "https://youtube.com/shorts/Lotday0l9SU?si=2dzW8Zxq41x-U7dp"
            ],
            "ROUND": [
                "https://youtube.com/shorts/pumZM_XPRj0?si=HppEQXZ1iLIVLX-y",
                "https://youtube.com/shorts/qx02EIPO2hQ?si=cu10FrxmIABQyEA1",
                "https://youtube.com/shorts/KAqBgepc_78?si=N47xoAhChu7koWCc",
                "https://youtube.com/shorts/E2SU45n95io?si=bJllZ6Wryh3Gr9mx",
                "https://youtube.com/shorts/HkhUIsbGQVQ?si=p8-OXdhh-sNMBqVm",
                "https://youtube.com/shorts/YnH8ptdvihM?si=zO-kYogZzeVlrh2T",
                "https://youtube.com/shorts/ZqochASYq8k?si=DAvGjQP_48zK8LDc",
                "https://youtube.com/shorts/g9pRFIDa_fo?si=uB9LIIsN_8ZlTaPs",
                "https://youtube.com/shorts/F8CVsX_ZJCU?si=jCTyg7-oaGTl-v9b",
                "https://youtube.com/shorts/QVQVBlhMOhw?si=ZzDTs6FfZjFArSTc"
            ],
            "SQUARE": [
                "https://youtu.be/zPTHuDH5fVE?si=04qx6n48c6a5kX50",
                "https://youtu.be/NeQgIqToM8E?si=Y-AhdyYazrLEVB4I",
                "https://youtu.be/4F9n798_exM?si=W_vEGgfxoaV607_B",
                "https://youtu.be/VN2Rra5sAX8?si=O3MnSIwvc41749sr",
                "https://youtube.com/shorts/pHPQe2kjAbw?si=pTZjeSdvnjyfCxt6",
                "https://youtube.com/shorts/Wkj4m-Cq7io?si=jOjdxnPuHR09w1MX",
                "https://youtube.com/shorts/yxjrw5nsNRk?si=LbCGE-LzTEgIrQNc",
                "https://youtube.com/shorts/WXVLAC6SNpE?si=SlRoiW0PUF9zWtsj",
                "https://youtube.com/shorts/9TMCJo1pSA8?si=7mpqFzkAWz002WJS",
                "https://youtube.com/shorts/4ia-cDDjwn0?si=dZWiWeFLudJd2-EZ"
            ]
        }

    def get_recommendations(self, predicted_face_shape):
        # Normalize input ke uppercase
        face_shape = predicted_face_shape.upper().strip()
        if face_shape in self.hijab_styles:
            return {
                "face_shape": face_shape,
                "recommendations": self.hijab_styles[face_shape],
                "total_recommendations": len(self.hijab_styles[face_shape]),
                "status": "success"
            }
        else:
            return {
                "face_shape": face_shape,
                "recommendations": [],
                "total_recommendations": 0,
                "status": "error",
                "message": f"Bentuk wajah '{face_shape}' tidak ditemukan dalam database"
            }

if __name__ == "__main__":
    # Baca argumen bentuk wajah dari command line
    face_shape = sys.argv[1] if len(sys.argv) > 1 else ""
    recommender = HijabStyleRecommendation()
    result = recommender.get_recommendations(face_shape)
    # Print output JSON ke stdout
    print(json.dumps(result))
