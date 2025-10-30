#!/usr/bin/env python3
"""
Generate all 66 symbolic illustrations for value cards
Following the "Symbolic Resonance" design philosophy
"""

from PIL import Image, ImageDraw
import math
import os

# Core Values Recovery colors
NAVY_RGB = (29, 68, 134)  # #1D4486
GOLD_RGB = (212, 170, 76)   # #D4AA4C
WHITE_RGB = (255, 255, 255)

SIZE = 300
CENTER = SIZE // 2
OUTPUT_DIR = "images/values"

def create_base():
    return Image.new('RGB', (SIZE, SIZE), WHITE_RGB)

# Batch 1 (already generated, included for completeness)
def achievement(img): draw = ImageDraw.Draw(img); points = [(80, 220), (120, 180), (150, 140), (180, 100), (220, 60)]; [draw.line([points[i], points[i+1]], fill=NAVY_RGB, width=12) for i in range(len(points)-1)]; draw.ellipse([205, 45, 235, 75], fill=GOLD_RGB)
def adventure(img): draw = ImageDraw.Draw(img); draw.arc([50, 50, 250, 250], 45, 315, fill=NAVY_RGB, width=10); draw.polygon([(CENTER, 80), (CENTER-15, CENTER), (CENTER+15, CENTER)], fill=GOLD_RGB)
def authenticity(img): draw = ImageDraw.Draw(img); draw.rectangle([140, 50, 160, 250], fill=NAVY_RGB); draw.ellipse([145, 40, 155, 50], fill=GOLD_RGB)
def authority(img): draw = ImageDraw.Draw(img); draw.rectangle([90, 90, 210, 210], fill=NAVY_RGB); draw.rectangle([190, 90, 210, 110], fill=GOLD_RGB)
def autonomy(img): draw = ImageDraw.Draw(img); draw.ellipse([75, 75, 225, 225], fill=NAVY_RGB); draw.ellipse([140, 140, 160, 160], fill=GOLD_RGB)
def balance(img): draw = ImageDraw.Draw(img); draw.ellipse([60, 120, 140, 200], fill=NAVY_RGB); draw.ellipse([160, 120, 240, 200], fill=GOLD_RGB); draw.line([(100, 160), (200, 160)], fill=NAVY_RGB, width=6)
def beauty(img): draw = ImageDraw.Draw(img); angles = [0, 72, 144, 216, 288]; radius = 40; [draw.ellipse([CENTER + int(radius * math.cos(math.radians(a)))-30, CENTER + int(radius * math.sin(math.radians(a)))-30, CENTER + int(radius * math.cos(math.radians(a)))+30, CENTER + int(radius * math.sin(math.radians(a)))+30], fill=GOLD_RGB) for a in angles]; draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=NAVY_RGB)
def boldness(img): draw = ImageDraw.Draw(img); draw.line([(80, 80), (220, 220)], fill=GOLD_RGB, width=25); draw.ellipse([70, 70, 90, 90], fill=NAVY_RGB)
def challenge(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 60), (100, 200), (200, 200)], fill=NAVY_RGB); draw.polygon([(CENTER, 60), (CENTER-20, 100), (CENTER+20, 100)], fill=GOLD_RGB)
def citizenship(img): draw = ImageDraw.Draw(img); points = [(CENTER + 70 * math.cos(math.radians(60 * i)), CENTER + 70 * math.sin(math.radians(60 * i))) for i in range(6)]; draw.polygon(points, outline=NAVY_RGB, width=8); draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=GOLD_RGB)

# Batch 2
def compassion(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], outline=NAVY_RGB, width=10); draw.polygon([(CENTER, CENTER+20), (CENTER-30, CENTER+50), (CENTER+30, CENTER+50)], fill=GOLD_RGB)
def community(img): draw = ImageDraw.Draw(img); for i in range(5): x = CENTER + 60 * math.cos(math.radians(72 * i - 90)); y = CENTER + 60 * math.sin(math.radians(72 * i - 90)); draw.ellipse([x-20, y-20, x+20, y+20], fill=NAVY_RGB); draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=GOLD_RGB)
def competency(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 70), (220, CENTER), (CENTER, 230), (80, CENTER)], fill=NAVY_RGB); draw.rectangle([CENTER-10, CENTER-10, CENTER+10, CENTER+10], fill=GOLD_RGB)
def connection(img): draw = ImageDraw.Draw(img); draw.ellipse([70, 110, 130, 170], fill=NAVY_RGB); draw.ellipse([170, 110, 230, 170], fill=GOLD_RGB); draw.line([(100, 140), (200, 140)], fill=NAVY_RGB, width=8)
def contribution(img): draw = ImageDraw.Draw(img); draw.ellipse([115, 115, 185, 185], outline=NAVY_RGB, width=10); draw.line([(CENTER, 100), (CENTER, 200)], fill=GOLD_RGB, width=8); draw.line([(100, CENTER), (200, CENTER)], fill=GOLD_RGB, width=8)
def courage(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 70), (200, 150), (CENTER, 230)], fill=GOLD_RGB); draw.ellipse([CENTER-20, CENTER-20, CENTER+20, CENTER+20], fill=NAVY_RGB)
def creativity(img): draw = ImageDraw.Draw(img); for i in range(8): a = math.radians(45 * i); r1, r2 = (30, 80) if i % 2 == 0 else (80, 30); draw.line([(CENTER, CENTER), (CENTER + r1 * math.cos(a), CENTER + r1 * math.sin(a))], fill=GOLD_RGB if i % 2 == 0 else NAVY_RGB, width=6)
def curiosity(img): draw = ImageDraw.Draw(img); draw.arc([80, 80, 220, 220], 220, 500, fill=NAVY_RGB, width=12); draw.ellipse([CENTER-8, 60, CENTER+8, 76], fill=GOLD_RGB)
def determination(img): draw = ImageDraw.Draw(img); draw.polygon([(90, CENTER), (CENTER, 80), (210, CENTER), (CENTER, 220)], fill=NAVY_RGB); draw.polygon([(CENTER-10, CENTER), (CENTER, CENTER-30), (CENTER+10, CENTER)], fill=GOLD_RGB)
def fairness(img): draw = ImageDraw.Draw(img); draw.line([(90, 160), (210, 160)], fill=NAVY_RGB, width=12); draw.ellipse([85, 155, 95, 165], fill=GOLD_RGB); draw.ellipse([205, 155, 215, 165], fill=GOLD_RGB); draw.rectangle([CENTER-3, 120, CENTER+3, 160], fill=NAVY_RGB)

# Batch 3
def faith(img): draw = ImageDraw.Draw(img); draw.line([(CENTER, 70), (CENTER, 230)], fill=NAVY_RGB, width=15); draw.line([(120, 120), (180, 120)], fill=GOLD_RGB, width=15)
def fame(img): draw = ImageDraw.Draw(img); for i in range(8): a = math.radians(45 * i); draw.line([(CENTER, CENTER), (CENTER + 90 * math.cos(a), CENTER + 90 * math.sin(a))], fill=GOLD_RGB if i % 2 == 0 else NAVY_RGB, width=4)
def freedom(img): draw = ImageDraw.Draw(img); draw.arc([60, 60, 240, 240], 180, 360, fill=NAVY_RGB, width=12); draw.polygon([(CENTER, 100), (CENTER-20, 130), (CENTER+20, 130)], fill=GOLD_RGB)
def friendships(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 110, 130, 150], fill=NAVY_RGB); draw.ellipse([170, 110, 210, 150], fill=GOLD_RGB); draw.arc([100, 160, 200, 220], 0, 180, fill=NAVY_RGB, width=8)
def fun(img): draw = ImageDraw.Draw(img); draw.arc([80, 100, 220, 240], 0, 180, fill=GOLD_RGB, width=15); draw.ellipse([130, 130, 145, 145], fill=NAVY_RGB); draw.ellipse([155, 130, 170, 145], fill=NAVY_RGB)
def generosity(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], outline=NAVY_RGB, width=10); for a in [0, 90, 180, 270]: x, y = CENTER + 70 * math.cos(math.radians(a)), CENTER + 70 * math.sin(math.radians(a)); draw.polygon([(x, y), (x + 15 * math.cos(math.radians(a)), y + 15 * math.sin(math.radians(a))), (CENTER, CENTER)], fill=GOLD_RGB)
def gratitude(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 90, 200, 190], outline=GOLD_RGB, width=10); draw.arc([120, 120, 180, 160], 0, 180, fill=NAVY_RGB, width=8)
def growth(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 200), (CENTER-10, 210), (CENTER-10, 100), (CENTER, 90), (CENTER+10, 100), (CENTER+10, 210)], fill=NAVY_RGB); draw.polygon([(CENTER, 90), (CENTER-20, 110), (CENTER+20, 110)], fill=GOLD_RGB)
def happiness(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 80, 210, 200], outline=GOLD_RGB, width=10); draw.ellipse([125, 120, 140, 135], fill=NAVY_RGB); draw.ellipse([160, 120, 175, 135], fill=NAVY_RGB); draw.arc([115, 145, 185, 185], 0, 180, fill=NAVY_RGB, width=6)
def honesty(img): draw = ImageDraw.Draw(img); draw.rectangle([110, 110, 190, 190], outline=NAVY_RGB, width=12); draw.rectangle([130, 130, 170, 170], fill=GOLD_RGB)

# Batch 4
def hope(img): draw = ImageDraw.Draw(img); draw.arc([80, 120, 220, 260], 180, 360, fill=NAVY_RGB, width=12); draw.ellipse([CENTER-15, 70, CENTER+15, 100], fill=GOLD_RGB)
def humility(img): draw = ImageDraw.Draw(img); draw.arc([100, 100, 200, 200], 0, 360, fill=NAVY_RGB, width=8); draw.ellipse([CENTER-10, CENTER+30, CENTER+10, CENTER+50], fill=GOLD_RGB)
def integrity(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 80), (190, CENTER), (CENTER, 220), (110, CENTER)], outline=NAVY_RGB, width=12); draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=GOLD_RGB)
def joy(img): draw = ImageDraw.Draw(img); for i in range(6): a = math.radians(60 * i); x, y = CENTER + 70 * math.cos(a), CENTER + 70 * math.sin(a); draw.ellipse([x-15, y-15, x+15, y+15], fill=GOLD_RGB); draw.ellipse([CENTER-30, CENTER-30, CENTER+30, CENTER+30], fill=NAVY_RGB)
def justice(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 90), (CENTER, 210)], fill=NAVY_RGB); draw.line([(CENTER, 90), (CENTER, 210)], fill=NAVY_RGB, width=15); draw.line([(110, 120), (190, 120)], fill=GOLD_RGB, width=12); draw.rectangle([100, 160, 200, 180], fill=NAVY_RGB)
def kindness(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 100, 140, 150], fill=GOLD_RGB); draw.ellipse([160, 100, 210, 150], fill=GOLD_RGB); draw.polygon([(CENTER, 130), (90, 180), (CENTER, 220), (210, 180)], fill=NAVY_RGB)
def knowledge(img): draw = ImageDraw.Draw(img); draw.rectangle([110, 80, 190, 220], outline=NAVY_RGB, width=10); draw.line([(130, 100), (170, 100)], fill=GOLD_RGB, width=4); draw.line([(130, 130), (170, 130)], fill=GOLD_RGB, width=4); draw.line([(130, 160), (170, 160)], fill=GOLD_RGB, width=4); draw.line([(130, 190), (170, 190)], fill=GOLD_RGB, width=4)
def love(img): draw = ImageDraw.Draw(img); draw.ellipse([95, 100, 145, 150], fill=NAVY_RGB); draw.ellipse([155, 100, 205, 150], fill=NAVY_RGB); draw.polygon([(95, 125), (205, 125), (CENTER, 210)], fill=GOLD_RGB)
def loyalty(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], fill=NAVY_RGB); draw.polygon([(CENTER, CENTER), (CENTER-15, CENTER-30), (CENTER+15, CENTER-30)], fill=GOLD_RGB); draw.polygon([(CENTER, CENTER), (CENTER-15, CENTER+30), (CENTER+15, CENTER+30)], fill=GOLD_RGB)
def meaningful_work(img): draw = ImageDraw.Draw(img); draw.rectangle([100, 120, 140, 200], fill=NAVY_RGB); draw.rectangle([160, 120, 200, 200], fill=NAVY_RGB); draw.polygon([(CENTER, 80), (CENTER-40, 120), (CENTER+40, 120)], fill=GOLD_RGB)

# Batch 5
def openness(img): draw = ImageDraw.Draw(img); draw.arc([90, 90, 210, 210], 45, 315, fill=NAVY_RGB, width=15); draw.polygon([(210, CENTER), (220, CENTER-10), (230, CENTER), (220, CENTER+10)], fill=GOLD_RGB)
def optimism(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 80, 210, 200], outline=GOLD_RGB, width=10); draw.arc([115, 130, 185, 170], 0, 180, fill=NAVY_RGB, width=8); draw.ellipse([125, 110, 140, 125], fill=NAVY_RGB); draw.ellipse([160, 110, 175, 125], fill=NAVY_RGB)
def peace(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], fill=NAVY_RGB); draw.line([(CENTER, 110), (CENTER, 190)], fill=GOLD_RGB, width=10); draw.arc([120, 140, 180, 200], 180, 360, fill=GOLD_RGB, width=10)
def perseverance(img): draw = ImageDraw.Draw(img); draw.arc([70, 150, 150, 230], 0, 90, fill=NAVY_RGB, width=12); draw.arc([150, 100, 230, 180], 90, 180, fill=NAVY_RGB, width=12); draw.polygon([(220, 110), (230, 100), (240, 110), (230, 120)], fill=GOLD_RGB)
def pleasure(img): draw = ImageDraw.Draw(img); for i in range(5): a = math.radians(72 * i - 90); x, y = CENTER + 60 * math.cos(a), CENTER + 60 * math.sin(a); draw.ellipse([x-18, y-18, x+18, y+18], fill=GOLD_RGB); draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=NAVY_RGB)
def poise(img): draw = ImageDraw.Draw(img); draw.line([(CENTER, 80), (CENTER, 220)], fill=NAVY_RGB, width=12); draw.ellipse([CENTER-30, 150, CENTER+30, 210], outline=GOLD_RGB, width=8)
def popularity(img): draw = ImageDraw.Draw(img); draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=GOLD_RGB); for i in range(6): a = math.radians(60 * i); x, y = CENTER + 70 * math.cos(a), CENTER + 70 * math.sin(a); draw.ellipse([x-15, y-15, x+15, y+15], outline=NAVY_RGB, width=4)
def purpose(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 70), (180, CENTER), (CENTER, 230), (120, CENTER)], fill=NAVY_RGB); draw.ellipse([CENTER-20, CENTER-20, CENTER+20, CENTER+20], fill=GOLD_RGB)
def recognition(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 80), (180, 140), (160, 200), (CENTER, 170), (140, 200), (120, 140)], fill=GOLD_RGB); draw.ellipse([CENTER-20, CENTER-20, CENTER+20, CENTER+20], fill=NAVY_RGB)
def religion(img): draw = ImageDraw.Draw(img); draw.line([(CENTER, 70), (CENTER, 210)], fill=NAVY_RGB, width=15); draw.line([(110, 110), (190, 110)], fill=NAVY_RGB, width=15); draw.arc([110, 70, 190, 110], 180, 360, fill=GOLD_RGB, width=10)

# Batch 6
def reputation(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 90, 210, 210], outline=NAVY_RGB, width=12); for a in [0, 72, 144, 216, 288]: x, y = CENTER + 80 * math.cos(math.radians(a - 90)), CENTER + 80 * math.sin(math.radians(a - 90)); draw.ellipse([x-6, y-6, x+6, y+6], fill=GOLD_RGB)
def resilience(img): draw = ImageDraw.Draw(img); draw.arc([80, 80, 140, 140], 0, 180, fill=NAVY_RGB, width=10); draw.arc([160, 140, 220, 200], 180, 360, fill=NAVY_RGB, width=10); draw.ellipse([215, 195, 225, 205], fill=GOLD_RGB)
def respect(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 90), (190, CENTER), (CENTER, 210), (110, CENTER)], outline=NAVY_RGB, width=10); draw.ellipse([CENTER-20, CENTER-20, CENTER+20, CENTER+20], fill=GOLD_RGB)
def responsibility(img): draw = ImageDraw.Draw(img); draw.rectangle([110, 100, 190, 200], outline=NAVY_RGB, width=12); draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=GOLD_RGB)
def security(img): draw = ImageDraw.Draw(img); draw.rectangle([100, 130, 200, 220], fill=NAVY_RGB); draw.arc([100, 80, 200, 180], 180, 360, fill=NAVY_RGB); draw.arc([100, 80, 200, 180], 180, 360, fill=NAVY_RGB, width=10); draw.ellipse([CENTER-10, 160, CENTER+10, 180], fill=GOLD_RGB)
def self_care(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 90, 210, 210], fill=NAVY_RGB); draw.ellipse([110, 110, 190, 190], fill=WHITE_RGB); draw.ellipse([130, 130, 170, 170], fill=GOLD_RGB)
def self_respect(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], outline=NAVY_RGB, width=12); draw.line([(CENTER, 110), (CENTER, 190)], fill=GOLD_RGB, width=10); draw.ellipse([CENTER-15, 100, CENTER+15, 130], fill=GOLD_RGB)
def service(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], outline=NAVY_RGB, width=10); for a in [0, 90, 180, 270]: x, y = CENTER + 70 * math.cos(math.radians(a)), CENTER + 70 * math.sin(math.radians(a)); draw.line([(CENTER, CENTER), (x, y)], fill=GOLD_RGB, width=8)
def spirituality(img): draw = ImageDraw.Draw(img); draw.ellipse([110, 110, 190, 190], outline=GOLD_RGB, width=10); draw.line([(CENTER, 100), (CENTER, 200)], fill=NAVY_RGB, width=8); draw.line([(100, CENTER), (200, CENTER)], fill=NAVY_RGB, width=8); draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=GOLD_RGB)
def stability(img): draw = ImageDraw.Draw(img); draw.rectangle([90, 160, 210, 210], fill=NAVY_RGB); draw.polygon([(CENTER, 90), (110, 160), (190, 160)], fill=GOLD_RGB)

# Batch 7
def status(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 70), (190, 200), (110, 200)], fill=GOLD_RGB); draw.ellipse([CENTER-20, 80, CENTER+20, 120], fill=NAVY_RGB)
def success(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 80), (180, 140), (160, 200), (CENTER, 170), (140, 200), (120, 140)], fill=GOLD_RGB); draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=NAVY_RGB)
def trust(img): draw = ImageDraw.Draw(img); draw.ellipse([90, 100, 150, 160], fill=NAVY_RGB); draw.ellipse([150, 100, 210, 160], fill=GOLD_RGB); draw.arc([90, 130, 210, 220], 0, 180, fill=NAVY_RGB, width=10)
def trustworthiness(img): draw = ImageDraw.Draw(img); draw.ellipse([100, 100, 200, 200], outline=NAVY_RGB, width=12); draw.polygon([(CENTER-30, CENTER), (CENTER-10, CENTER+30), (CENTER+40, CENTER-40)], fill=GOLD_RGB)
def wealth(img): draw = ImageDraw.Draw(img); draw.polygon([(CENTER, 90), (180, CENTER), (CENTER, 210), (120, CENTER)], fill=GOLD_RGB); for a in [0, 90, 180, 270]: x, y = CENTER + 50 * math.cos(math.radians(a + 45)), CENTER + 50 * math.sin(math.radians(a + 45)); draw.ellipse([x-10, y-10, x+10, y+10], fill=NAVY_RGB)
def wisdom(img): draw = ImageDraw.Draw(img); draw.ellipse([CENTER-40, 100, CENTER+40, 180], outline=NAVY_RGB, width=10); draw.polygon([(CENTER, 140), (CENTER-10, 170), (CENTER, 200), (CENTER+10, 170)], fill=GOLD_RGB)

# Generate all
def generate_all():
    values = {
        'achievement': achievement, 'adventure': adventure, 'authenticity': authenticity,
        'authority': authority, 'autonomy': autonomy, 'balance': balance,
        'beauty': beauty, 'boldness': boldness, 'challenge': challenge,
        'citizenship': citizenship, 'compassion': compassion, 'community': community,
        'competency': competency, 'connection': connection, 'contribution': contribution,
        'courage': courage, 'creativity': creativity, 'curiosity': curiosity,
        'determination': determination, 'fairness': fairness, 'faith': faith,
        'fame': fame, 'freedom': freedom, 'friendships': friendships,
        'fun': fun, 'generosity': generosity, 'gratitude': gratitude,
        'growth': growth, 'happiness': happiness, 'honesty': honesty,
        'hope': hope, 'humility': humility, 'integrity': integrity,
        'joy': joy, 'justice': justice, 'kindness': kindness,
        'knowledge': knowledge, 'love': love, 'loyalty': loyalty,
        'meaningful-work': meaningful_work, 'openness': openness, 'optimism': optimism,
        'peace': peace, 'perseverance': perseverance, 'pleasure': pleasure,
        'poise': poise, 'popularity': popularity, 'purpose': purpose,
        'recognition': recognition, 'religion': religion, 'reputation': reputation,
        'resilience': resilience, 'respect': respect, 'responsibility': responsibility,
        'security': security, 'self-care': self_care, 'self-respect': self_respect,
        'service': service, 'spirituality': spirituality, 'stability': stability,
        'status': status, 'success': success, 'trust': trust,
        'trustworthiness': trustworthiness, 'wealth': wealth, 'wisdom': wisdom
    }

    for name, func in values.items():
        img = create_base()
        func(img)
        img.save(f"{OUTPUT_DIR}/{name}.png", 'PNG')
        print(f"✓ {name}.png")

    print(f"\n✅ Generated all {len(values)} value images!")

if __name__ == "__main__":
    generate_all()
