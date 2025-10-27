#!/usr/bin/env python3
"""
Generate warm, professional watercolor-style illustrations for value cards
Following the "Watercolor Warmth" design philosophy
"""

from PIL import Image, ImageDraw, ImageFilter
import math
import random

# Warm watercolor palette - Core Values Recovery inspired
COLORS = {
    'navy_warm': [(45, 90, 159), (74, 111, 165), (60, 85, 140)],  # Warm navy blues
    'gold_warm': [(212, 170, 76), (230, 193, 102), (240, 214, 140)],  # Rich golds/ambers
    'peach': [(245, 200, 180), (255, 220, 200), (250, 210, 190)],  # Soft peaches
    'cream': [(255, 250, 240), (250, 245, 235), (245, 240, 230)],  # Warm creams
    'terracotta': [(200, 140, 110), (210, 150, 120), (220, 160, 130)],  # Gentle terracotta
}

SIZE = 300
CENTER = SIZE // 2
OUT = "images/values"

def create_watercolor_base():
    """Create base with warm cream wash"""
    img = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    # Soft cream background wash
    for i in range(3):
        color = random.choice(COLORS['cream'])
        alpha = random.randint(10, 30)
        draw.ellipse([20, 20, SIZE-20, SIZE-20], fill=(*color, alpha))
    return img

def add_watercolor_circle(img, x, y, radius, color_family, alpha_range=(80, 150)):
    """Add soft watercolor circle with gradient effect"""
    layer = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)

    colors = COLORS[color_family]
    # Multiple layers for depth
    for i in range(3):
        r = radius * (1 - i * 0.15)
        color = random.choice(colors)
        alpha = random.randint(*alpha_range) - i * 20
        draw.ellipse([x-r, y-r, x+r, y+r], fill=(*color, max(20, alpha)))

    # Blur for soft watercolor edges
    layer = layer.filter(ImageFilter.GaussianBlur(radius=4 + random.randint(0, 2)))
    img.paste(layer, (0, 0), layer)
    return img

def add_watercolor_brushstroke(img, start, end, width, color_family, alpha=120):
    """Add flowing brushstroke"""
    layer = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)

    color = random.choice(COLORS[color_family])
    # Draw stroke with varying width
    draw.line([start, end], fill=(*color, alpha), width=int(width))

    # Add texture with smaller strokes
    for i in range(2):
        offset = random.randint(-3, 3)
        start_adj = (start[0] + offset, start[1] + offset)
        end_adj = (end[0] + offset, end[1] + offset)
        lighter_color = tuple(min(255, c + 20) for c in color)
        draw.line([start_adj, end_adj], fill=(*lighter_color, alpha//2), width=int(width*0.6))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=3))
    img.paste(layer, (0, 0), layer)
    return img

def add_watercolor_wash(img, points, color_family, alpha=100):
    """Add organic watercolor wash shape"""
    layer = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(layer)

    colors = COLORS[color_family]
    # Multiple layers for depth
    for i in range(2):
        color = random.choice(colors)
        alpha_val = alpha - i * 30
        draw.polygon(points, fill=(*color, alpha_val))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=5))
    img.paste(layer, (0, 0), layer)
    return img

# Value-specific watercolor compositions
def achievement_wc(img):
    """Ascending watercolor forms"""
    for i, y in enumerate([200, 160, 120, 80, 50]):
        add_watercolor_circle(img, 80 + i*40, y, 25, 'navy_warm' if i < 4 else 'gold_warm')
    return img

def adventure_wc(img):
    """Flowing path"""
    points = []
    for i in range(8):
        angle = math.radians(i * 45)
        r = 80 + math.sin(i) * 20
        points.append((CENTER + r * math.cos(angle), CENTER + r * math.sin(angle)))
    add_watercolor_wash(img, points, 'navy_warm', 100)
    add_watercolor_circle(img, CENTER, CENTER-40, 20, 'gold_warm', (120, 180))
    return img

def authenticity_wc(img):
    """Bold vertical flow"""
    add_watercolor_brushstroke(img, (CENTER, 60), (CENTER, 240), 30, 'navy_warm', 140)
    add_watercolor_circle(img, CENTER, 70, 15, 'gold_warm', (140, 200))
    return img

def balance_wc(img):
    """Two harmonious circles"""
    add_watercolor_circle(img, 110, 150, 45, 'navy_warm')
    add_watercolor_circle(img, 190, 150, 45, 'gold_warm')
    add_watercolor_brushstroke(img, (110, 150), (190, 150), 8, 'terracotta', 80)
    return img

def beauty_wc(img):
    """Flower-like petals"""
    for i in range(6):
        angle = math.radians(60 * i)
        x = CENTER + 60 * math.cos(angle)
        y = CENTER + 60 * math.sin(angle)
        add_watercolor_circle(img, int(x), int(y), 30, 'gold_warm' if i % 2 == 0 else 'peach')
    add_watercolor_circle(img, CENTER, CENTER, 35, 'navy_warm')
    return img

def compassion_wc(img):
    """Heart glow"""
    add_watercolor_circle(img, CENTER, CENTER, 60, 'peach', (60, 100))
    add_watercolor_circle(img, CENTER, CENTER, 40, 'gold_warm', (100, 150))
    points = [(CENTER, CENTER+20), (CENTER-35, CENTER+55), (CENTER+35, CENTER+55)]
    add_watercolor_wash(img, points, 'navy_warm', 120)
    return img

def connection_wc(img):
    """Overlapping circles"""
    add_watercolor_circle(img, 110, 150, 50, 'navy_warm', (100, 140))
    add_watercolor_circle(img, 190, 150, 50, 'gold_warm', (100, 140))
    return img

def courage_wc(img):
    """Forward arrow wash"""
    points = [(120, 80), (230, 150), (120, 220)]
    add_watercolor_wash(img, points, 'gold_warm', 130)
    add_watercolor_circle(img, CENTER, CENTER, 25, 'navy_warm', (140, 200))
    return img

def creativity_wc(img):
    """Radiating energy"""
    for i in range(8):
        angle = math.radians(45 * i)
        x1, y1 = CENTER, CENTER
        x2 = CENTER + 90 * math.cos(angle)
        y2 = CENTER + 90 * math.sin(angle)
        color = 'gold_warm' if i % 2 == 0 else 'navy_warm'
        add_watercolor_brushstroke(img, (x1, y1), (x2, y2), 8, color, 100)
    return img

def faith_wc(img):
    """Cross with warmth"""
    add_watercolor_brushstroke(img, (CENTER, 70), (CENTER, 230), 20, 'navy_warm', 130)
    add_watercolor_brushstroke(img, (120, 120), (180, 120), 20, 'gold_warm', 130)
    return img

def freedom_wc(img):
    """Rising arc"""
    points = [(80, 200), (CENTER, 100), (220, 200)]
    add_watercolor_wash(img, points, 'navy_warm', 110)
    points = [(CENTER, 100), (CENTER-25, 140), (CENTER+25, 140)]
    add_watercolor_wash(img, points, 'gold_warm', 140)
    return img

def gratitude_wc(img):
    """Gentle smile"""
    add_watercolor_circle(img, CENTER, CENTER, 65, 'gold_warm', (70, 110))
    add_watercolor_brushstroke(img, (120, 160), (180, 160), 10, 'navy_warm', 120)
    return img

def growth_wc(img):
    """Upward flowing form"""
    for i, y in enumerate([220, 180, 140, 100, 70]):
        size = 30 - i * 3
        add_watercolor_circle(img, CENTER, y, size, 'navy_warm' if y > 100 else 'gold_warm')
    return img

def happiness_wc(img):
    """Warm smile"""
    add_watercolor_circle(img, CENTER, CENTER, 70, 'gold_warm', (80, 120))
    add_watercolor_circle(img, 130, 130, 12, 'navy_warm', (150, 200))
    add_watercolor_circle(img, 170, 130, 12, 'navy_warm', (150, 200))
    add_watercolor_brushstroke(img, (125, 170), (175, 170), 8, 'navy_warm', 130)
    return img

def hope_wc(img):
    """Sunrise glow"""
    add_watercolor_circle(img, CENTER, 180, 80, 'gold_warm', (70, 110))
    add_watercolor_circle(img, CENTER, 90, 25, 'navy_warm', (130, 180))
    return img

def integrity_wc(img):
    """Diamond clarity"""
    points = [(CENTER, 80), (200, CENTER), (CENTER, 220), (100, CENTER)]
    add_watercolor_wash(img, points, 'navy_warm', 110)
    add_watercolor_circle(img, CENTER, CENTER, 20, 'gold_warm', (140, 200))
    return img

def joy_wc(img):
    """Celebration circles"""
    positions = [(CENTER, CENTER-70), (CENTER+60, CENTER-35), (CENTER+60, CENTER+35),
                 (CENTER, CENTER+70), (CENTER-60, CENTER+35), (CENTER-60, CENTER-35)]
    for i, (x, y) in enumerate(positions):
        add_watercolor_circle(img, int(x), int(y), 22, 'gold_warm' if i % 2 == 0 else 'peach')
    add_watercolor_circle(img, CENTER, CENTER, 35, 'navy_warm')
    return img

def kindness_wc(img):
    """Gentle heart"""
    add_watercolor_circle(img, 115, 125, 35, 'peach')
    add_watercolor_circle(img, 185, 125, 35, 'peach')
    points = [(CENTER, 140), (100, 190), (CENTER, 230), (200, 190)]
    add_watercolor_wash(img, points, 'navy_warm', 120)
    return img

def love_wc(img):
    """Heart warmth"""
    add_watercolor_circle(img, 115, 125, 40, 'navy_warm', (110, 150))
    add_watercolor_circle(img, 185, 125, 40, 'navy_warm', (110, 150))
    points = [(100, 135), (210, 135), (CENTER, 220)]
    add_watercolor_wash(img, points, 'gold_warm', 140)
    return img

def peace_wc(img):
    """Peaceful circle"""
    add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (90, 130))
    add_watercolor_brushstroke(img, (CENTER, 120), (CENTER, 180), 12, 'gold_warm', 130)
    return img

def purpose_wc(img):
    """Centered diamond"""
    points = [(CENTER, 80), (180, CENTER), (CENTER, 220), (120, CENTER)]
    add_watercolor_wash(img, points, 'navy_warm', 110)
    add_watercolor_circle(img, CENTER, CENTER, 25, 'gold_warm', (150, 200))
    return img

def resilience_wc(img):
    """Bouncing flow"""
    points = [(80, 150), (120, 100), (160, 150), (200, 100), (240, 150)]
    for i in range(len(points)-1):
        add_watercolor_brushstroke(img, points[i], points[i+1], 12, 'navy_warm', 110)
    add_watercolor_circle(img, 230, 150, 15, 'gold_warm', (140, 200))
    return img

def respect_wc(img):
    """Balanced diamond"""
    points = [(CENTER, 100), (180, CENTER), (CENTER, 200), (120, CENTER)]
    add_watercolor_wash(img, points, 'navy_warm', 100)
    add_watercolor_circle(img, CENTER, CENTER, 22, 'gold_warm', (140, 200))
    return img

def service_wc(img):
    """Radiating giving"""
    add_watercolor_circle(img, CENTER, CENTER, 65, 'navy_warm', (70, 110))
    for angle in [0, 90, 180, 270]:
        a = math.radians(angle)
        x, y = CENTER + 75 * math.cos(a), CENTER + 75 * math.sin(a)
        add_watercolor_brushstroke(img, (CENTER, CENTER), (x, y), 10, 'gold_warm', 120)
    return img

def spirituality_wc(img):
    """Cross of light"""
    add_watercolor_circle(img, CENTER, CENTER, 65, 'gold_warm', (70, 110))
    add_watercolor_brushstroke(img, (CENTER, 110), (CENTER, 190), 12, 'navy_warm', 120)
    add_watercolor_brushstroke(img, (110, CENTER), (190, CENTER), 12, 'navy_warm', 120)
    return img

def trust_wc(img):
    """Linked warmth"""
    add_watercolor_circle(img, 115, 140, 45, 'navy_warm', (100, 140))
    add_watercolor_circle(img, 185, 140, 45, 'gold_warm', (100, 140))
    return img

def wisdom_wc(img):
    """Contemplative eye"""
    add_watercolor_circle(img, CENTER, 140, 50, 'navy_warm', (80, 120))
    add_watercolor_circle(img, CENTER, 160, 25, 'gold_warm', (130, 180))
    return img

# Map all 66 values to functions
VALUE_FUNCTIONS = {
    'achievement': achievement_wc, 'adventure': adventure_wc, 'authenticity': authenticity_wc,
    'authority': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (100, 150)) or add_watercolor_circle(img, CENTER, CENTER, 45, 'gold_warm', (70, 110)) or img,
    'autonomy': lambda img: add_watercolor_circle(img, CENTER, CENTER, 65, 'navy_warm', (90, 140)) or add_watercolor_circle(img, CENTER, CENTER, 25, 'gold_warm', (140, 200)) or img,
    'balance': balance_wc, 'beauty': beauty_wc,
    'boldness': lambda img: add_watercolor_brushstroke(img, (90, 90), (210, 210), 30, 'gold_warm', 140) or img,
    'challenge': lambda img: add_watercolor_wash(img, [(CENTER, 70), (110, 190), (190, 190)], 'navy_warm', 120) or add_watercolor_circle(img, CENTER, 80, 20, 'gold_warm', (150, 200)) or img,
    'citizenship': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (70, 110)) or add_watercolor_circle(img, CENTER, CENTER, 20, 'gold_warm', (150, 200)) or img,
    'compassion': compassion_wc, 'community': lambda img: sum([add_watercolor_circle(img, int(CENTER + 65 * math.cos(math.radians(72*i-90))), int(CENTER + 65 * math.sin(math.radians(72*i-90))), 28, 'navy_warm' if i < 3 else 'peach') for i in range(5)], img),
    'competency': lambda img: add_watercolor_wash(img, [(CENTER, 80), (210, CENTER), (CENTER, 220), (90, CENTER)], 'navy_warm', 110) or add_watercolor_circle(img, CENTER, CENTER, 18, 'gold_warm', (150, 200)) or img,
    'connection': connection_wc, 'contribution': lambda img: add_watercolor_circle(img, CENTER, CENTER, 65, 'navy_warm', (80, 120)) or add_watercolor_brushstroke(img, (CENTER, 110), (CENTER, 190), 10, 'gold_warm', 130) or add_watercolor_brushstroke(img, (110, CENTER), (190, CENTER), 10, 'gold_warm', 130) or img,
    'courage': courage_wc, 'creativity': creativity_wc,
    'curiosity': lambda img: add_watercolor_circle(img, CENTER, 160, 70, 'navy_warm', (80, 120)) or add_watercolor_circle(img, CENTER, 80, 18, 'gold_warm', (150, 200)) or img,
    'determination': lambda img: add_watercolor_wash(img, [(100, CENTER), (CENTER, 90), (200, CENTER), (CENTER, 210)], 'navy_warm', 120) or add_watercolor_wash(img, [(CENTER-15, CENTER), (CENTER, CENTER-35), (CENTER+15, CENTER)], 'gold_warm', 150) or img,
    'fairness': lambda img: add_watercolor_brushstroke(img, (100, 150), (200, 150), 14, 'navy_warm', 130) or add_watercolor_circle(img, 100, 150, 12, 'gold_warm', (150, 200)) or add_watercolor_circle(img, 200, 150, 12, 'gold_warm', (150, 200)) or img,
    'faith': faith_wc, 'fame': lambda img: sum([add_watercolor_brushstroke(img, (CENTER, CENTER), (CENTER + 85 * math.cos(math.radians(45*i)), CENTER + 85 * math.sin(math.radians(45*i))), 8, 'gold_warm' if i%2==0 else 'navy_warm', 110) for i in range(8)], img),
    'freedom': freedom_wc, 'friendships': lambda img: add_watercolor_circle(img, 110, 140, 35, 'navy_warm') or add_watercolor_circle(img, 190, 140, 35, 'gold_warm') or img,
    'fun': lambda img: add_watercolor_circle(img, CENTER, 150, 65, 'gold_warm', (90, 130)) or add_watercolor_circle(img, 135, 135, 12, 'navy_warm', (150, 200)) or add_watercolor_circle(img, 165, 135, 12, 'navy_warm', (150, 200)) or img,
    'generosity': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (80, 120)) or sum([add_watercolor_circle(img, int(CENTER + 75 * math.cos(math.radians(a))), int(CENTER + 75 * math.sin(math.radians(a))), 18, 'gold_warm', (130, 180)) for a in [0, 90, 180, 270]], img),
    'gratitude': gratitude_wc, 'growth': growth_wc, 'happiness': happiness_wc,
    'honesty': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (80, 120)) or add_watercolor_circle(img, CENTER, CENTER, 35, 'gold_warm', (110, 160)) or img,
    'hope': hope_wc, 'humility': lambda img: add_watercolor_circle(img, CENTER, CENTER, 60, 'navy_warm', (70, 110)) or add_watercolor_circle(img, CENTER, CENTER+45, 18, 'gold_warm', (140, 200)) or img,
    'integrity': integrity_wc, 'joy': joy_wc, 'justice': lambda img: add_watercolor_brushstroke(img, (CENTER, 100), (CENTER, 200), 18, 'navy_warm', 130) or add_watercolor_brushstroke(img, (120, 130), (180, 130), 14, 'gold_warm', 130) or img,
    'kindness': kindness_wc, 'knowledge': lambda img: add_watercolor_circle(img, CENTER, CENTER, 75, 'navy_warm', (70, 110)) or sum([add_watercolor_brushstroke(img, (125, 115+i*25), (175, 115+i*25), 6, 'gold_warm', 120) for i in range(4)], img),
    'love': love_wc, 'loyalty': lambda img: add_watercolor_circle(img, CENTER, CENTER, 65, 'navy_warm', (100, 150)) or add_watercolor_wash(img, [(CENTER, CENTER), (CENTER-18, CENTER-40), (CENTER+18, CENTER-40)], 'gold_warm', 150) or img,
    'meaningful-work': lambda img: add_watercolor_circle(img, 120, 160, 50, 'navy_warm', (100, 140)) or add_watercolor_circle(img, 180, 160, 50, 'navy_warm', (100, 140)) or add_watercolor_wash(img, [(CENTER, 90), (CENTER-45, 130), (CENTER+45, 130)], 'gold_warm', 140) or img,
    'openness': lambda img: add_watercolor_circle(img, CENTER, CENTER, 75, 'navy_warm', (60, 100)) or add_watercolor_wash(img, [(200, CENTER), (215, CENTER-12), (225, CENTER), (215, CENTER+12)], 'gold_warm', 150) or img,
    'optimism': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'gold_warm', (80, 120)) or add_watercolor_circle(img, 135, 125, 12, 'navy_warm', (150, 200)) or add_watercolor_circle(img, 165, 125, 12, 'navy_warm', (150, 200)) or add_watercolor_brushstroke(img, (130, 165), (170, 165), 8, 'navy_warm', 130) or img,
    'peace': peace_wc, 'perseverance': resilience_wc,
    'pleasure': lambda img: sum([add_watercolor_circle(img, int(CENTER + 65 * math.cos(math.radians(72*i-90))), int(CENTER + 65 * math.sin(math.radians(72*i-90))), 25, 'gold_warm' if i%2==0 else 'peach') for i in range(5)], add_watercolor_circle(img, CENTER, CENTER, 30, 'navy_warm')),
    'poise': lambda img: add_watercolor_brushstroke(img, (CENTER, 90), (CENTER, 210), 14, 'navy_warm', 130) or add_watercolor_circle(img, CENTER, 180, 35, 'gold_warm', (90, 140)) or img,
    'popularity': lambda img: add_watercolor_circle(img, CENTER, CENTER, 30, 'gold_warm', (130, 180)) or sum([add_watercolor_circle(img, int(CENTER + 75 * math.cos(math.radians(60*i))), int(CENTER + 75 * math.sin(math.radians(60*i))), 20, 'navy_warm', (70, 110)) for i in range(6)], img),
    'purpose': purpose_wc, 'recognition': lambda img: sum([add_watercolor_circle(img, *[(CENTER, 95), (170, 130), (155, 185), (CENTER, 160), (145, 185), (130, 130)][i], 22, 'gold_warm' if i < 4 else 'navy_warm', (110, 160)) for i in range(6)], img),
    'religion': lambda img: add_watercolor_brushstroke(img, (CENTER, 80), (CENTER, 200), 16, 'navy_warm', 130) or add_watercolor_brushstroke(img, (120, 120), (180, 120), 16, 'navy_warm', 130) or add_watercolor_circle(img, CENTER, 95, 35, 'gold_warm', (80, 130)) or img,
    'reputation': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (70, 110)) or sum([add_watercolor_circle(img, int(CENTER + 80 * math.cos(math.radians(i-90))), int(CENTER + 80 * math.sin(math.radians(i-90))), 12, 'gold_warm', (140, 200)) for i in [0, 72, 144, 216, 288]], img),
    'resilience': resilience_wc, 'respect': respect_wc, 'responsibility': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (80, 120)) or add_watercolor_circle(img, CENTER, CENTER, 20, 'gold_warm', (150, 200)) or img,
    'security': lambda img: add_watercolor_circle(img, CENTER, 120, 75, 'navy_warm', (90, 140)) or add_watercolor_circle(img, CENTER, 165, 15, 'gold_warm', (150, 200)) or img,
    'self-care': lambda img: add_watercolor_circle(img, CENTER, CENTER, 75, 'navy_warm', (70, 110)) or add_watercolor_circle(img, CENTER, CENTER, 50, 'peach', (60, 100)) or add_watercolor_circle(img, CENTER, CENTER, 25, 'gold_warm', (130, 180)) or img,
    'self-respect': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (80, 120)) or add_watercolor_brushstroke(img, (CENTER, 120), (CENTER, 180), 12, 'gold_warm', 140) or add_watercolor_circle(img, CENTER, 115, 20, 'gold_warm', (130, 180)) or img,
    'service': service_wc, 'spirituality': spirituality_wc,
    'stability': lambda img: add_watercolor_circle(img, CENTER, 185, 60, 'navy_warm', (100, 150)) or add_watercolor_wash(img, [(CENTER, 100), (120, 175), (180, 175)], 'gold_warm', 140) or img,
    'status': lambda img: add_watercolor_wash(img, [(CENTER, 80), (180, 190), (120, 190)], 'gold_warm', 130) or add_watercolor_circle(img, CENTER, 100, 25, 'navy_warm', (140, 200)) or img,
    'success': lambda img: sum([add_watercolor_circle(img, *[(CENTER, 95), (170, 130), (155, 185), (CENTER, 160), (145, 185), (130, 130)][i], 20, 'gold_warm' if i != 5 else 'navy_warm', (110, 160)) for i in range(6)], img),
    'trust': trust_wc, 'trustworthiness': lambda img: add_watercolor_circle(img, CENTER, CENTER, 70, 'navy_warm', (80, 120)) or add_watercolor_wash(img, [(CENTER-35, CENTER), (CENTER-12, CENTER+35), (CENTER+45, CENTER-45)], 'gold_warm', 140) or img,
    'wealth': lambda img: add_watercolor_wash(img, [(CENTER, 100), (170, CENTER), (CENTER, 200), (130, CENTER)], 'gold_warm', 120) or sum([add_watercolor_circle(img, int(CENTER + 55 * math.cos(math.radians(a+45))), int(CENTER + 55 * math.sin(math.radians(a+45))), 15, 'navy_warm', (120, 170)) for a in [0, 90, 180, 270]], img),
    'wisdom': wisdom_wc,
}

def generate_all_watercolor():
    """Generate all 66 watercolor value images"""
    for name, func in VALUE_FUNCTIONS.items():
        img = create_watercolor_base()
        func(img)
        # Convert RGBA to RGB
        bg = Image.new('RGB', img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        bg.save(f"{OUT}/{name}.png", 'PNG')
        print(f"✓ {name}.png")
    print(f"\n✅ Generated all {len(VALUE_FUNCTIONS)} watercolor value images!")

if __name__ == "__main__":
    random.seed(42)  # For consistent results
    generate_all_watercolor()
