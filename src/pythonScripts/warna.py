import sys
import json

class ColorRecommendationSystem:
    def __init__(self):
        self.color_groups = {
            'summer light': ['#f5e5f2', '#cebcae', '#91887c', '#e17d93', '#d35473',
                             '#7f83c2', '#de7e9f', '#be91a8', '#675763', '#2f3f56',
                             '#5c7cab', '#81c099', '#678a8b', '#b95369'],
            'summer cool': ['#f5e5f0', '#e6cbca', '#8a4748', '#f07db2', '#de1081',
                            '#c898cc', '#fc7296', '#d9495b', '#358c79', '#59c2be',
                            '#41457d', '#2b3957', '#712775', '#c76396'],
            'summer soft': ['#f3e5f0', '#ccbdac', '#8f887a', '#e494a5', '#d95475',
                            '#7e84bc', '#de7e9f', '#bb546a', '#678887', '#a5c9d2',
                            '#5a7fa6', '#2b405d', '#6a5563', '#c48da9'],
            'autumn soft': ['#e8e1d2', '#d4c3ad', '#5d563b', '#a19d75', '#674b43',
                            '#56917b', '#e3afb0', '#648b8e', '#5a81ad', '#9c6661',
                            '#b83c5d', '#e64b65', '#c1956f', '#c26554'],
            'autumn warm': ['#fdfdc0', '#4a0d0a', '#8c020c', '#e65825', '#f4b720',
                            '#3e530e', '#b70108', '#fcaf25', '#e73043', '#c04941',
                            '#9d575b', '#143518', '#93a436', '#cfa843'],
            'autumn deep': ['#f3e8be', '#39423a', '#60202f', '#934517', '#2b4738',
                            '#153d0c', '#5b0056', '#734c05', '#a2010c', '#9a1c3b',
                            '#430148', '#142d10', '#9ba436', '#a47d3e'],
            'winter deep': ['#08312e', '#182c5a', '#45274a', '#c5014f', '#eb252e',
                            '#0d64ad', '#d70055', '#632e72', '#ae1421', '#010101',
                            '#f3f4f8', '#e8e16c', '#cfbeaa', '#39383c'],
            'winter cool': ['#f7cadf', '#e1699d', '#bf1144', '#573a90', '#1a3480',
                            '#e84287', '#921d51', '#b06bc3', '#a7307a', '#020100',
                            '#fefefe', '#2da84d', '#136949', '#97e0e5'],
            'winter bright': ['#178f48', '#1aa6e1', '#691f8a', '#d20162', '#fd0416',
                              '#0b49c5', '#d4006f', '#afdcd7', '#dc0024', '#010101',
                              '#fdfdfd', '#e9f9ca', '#fcecec', '#f6f5fb'],
            'spring bright': ['#8e32fb', '#99ce46', '#f846c2', '#f0501b', '#140a61',
                              '#18f1f0', '#fffc28', '#f53509', '#40b215', '#a66b32',
                              '#c0621c', '#ebe6d0', '#fefeda', '#fefffa'],
            'spring warm': ['#4c927d', '#4ac8c1', '#fc5460', '#fd3e6a', '#db353d',
                            '#fdab88', '#fa2661', '#fb9748', '#f6363b', '#8eba37',
                            '#fac237', '#c4915a', '#d5b88e', '#fefdf3'],
            'spring light': ['#7a6960', '#efc7c7', '#f48e93', '#ec5a76', '#d03e3b',
                             '#6bb2d5', '#f6e872', '#fe9b96', '#aac57b', '#97c9d7',
                             '#ae9ec0', '#c7905b', '#fdfdec', '#cfb195']
        }

        self.skin_tone_rules = {
            'dark': [
                'winter deep',
                'autumn deep',
                'winter cool',
                'summer cool',
                'autumn warm',
                'winter bright',
                'summer soft',
                'autumn soft',
                'spring warm',
                'summer light',
                'spring bright',
                'spring light'
            ],
            'mid dark': [
                'autumn deep',
                'winter deep',
                'autumn warm',
                'summer cool',
                'winter cool',
                'summer soft',
                'autumn soft',
                'winter bright',
                'spring warm',
                'summer light',
                'spring bright',
                'spring light'
            ],
            'mid light': [
                'autumn warm',
                'summer soft',
                'autumn soft',
                'spring warm',
                'summer cool',
                'autumn deep',
                'winter cool',
                'summer light',
                'spring bright',
                'winter bright',
                'winter deep',
                'spring light'
            ],
            'light': [
                'spring light',
                'summer light',
                'spring bright',
                'spring warm',
                'summer soft',
                'winter bright',
                'autumn soft',
                'summer cool',
                'autumn warm',
                'winter cool',
                'autumn deep',
                'winter deep'
            ]
        }

    def get_recommended_groups(self, predicted_skin_tone):
        """
        Mengembalikan SEMUA group dengan semua warna sesuai urutan rules.
        """
        group_names = self.skin_tone_rules.get(predicted_skin_tone, [])
        result = []
        for group in group_names:
            colors = self.color_groups.get(group, [])
            result.append({
                "group": group,
                "colors": colors
            })
        return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No skin tone argument provided.'}))
        sys.exit(1)
    predicted_skin_tone = sys.argv[1].lower()

    color_system = ColorRecommendationSystem()
    try:
        recommended_groups = color_system.get_recommended_groups(predicted_skin_tone)
        output = {
            "skin_tone": predicted_skin_tone,
            "recommended_groups": recommended_groups
        }
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
