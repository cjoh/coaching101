#!/usr/bin/env python3
"""
Generate symbolic illustrations for value cards
Following the "Symbolic Resonance" design philosophy
Core Values Recovery branding: Navy #1D4486, Gold #D4AA4C
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

# Core Values Recovery colors
NAVY = "#1D4486"
GOLD = "#D4AA4C"
WHITE = "#FFFFFF"

# Image settings
SIZE = 300
CENTER = SIZE // 2
OUTPUT_DIR = "images/values"

def create_base_canvas():
    """Create white canvas"""
    return Image.new('RGB', (SIZE, SIZE), WHITE)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Convert colors
NAVY_RGB = hex_to_rgb(NAVY)
GOLD_RGB = hex_to_rgb(GOLD)

# Value symbols - minimalist geometric representations
def draw_achievement(img):
    """Ascending steps/mountain peak"""
    draw = ImageDraw.Draw(img)
    # Rising stairs in navy, gold accent at peak
    points = [(80, 220), (120, 180), (150, 140), (180, 100), (220, 60)]
    for i in range(len(points)-1):
        draw.line([points[i], points[i+1]], fill=NAVY_RGB, width=12)
    # Gold star at peak
    draw.ellipse([205, 45, 235, 75], fill=GOLD_RGB)

def draw_adventure(img):
    """Winding path/compass needle"""
    draw = ImageDraw.Draw(img)
    # Curving path in navy
    draw.arc([50, 50, 250, 250], 45, 315, fill=NAVY_RGB, width=10)
    # Gold compass point
    draw.polygon([(CENTER, 80), (CENTER-15, CENTER), (CENTER+15, CENTER)], fill=GOLD_RGB)

def draw_authenticity(img):
    """Single bold brushstroke/vertical line"""
    draw = ImageDraw.Draw(img)
    # Bold vertical stroke in navy - strong and true
    draw.rectangle([140, 50, 160, 250], fill=NAVY_RGB)
    # Small gold accent at top
    draw.ellipse([145, 40, 155, 50], fill=GOLD_RGB)

def draw_authority(img):
    """Solid square/foundation"""
    draw = ImageDraw.Draw(img)
    # Strong square base in navy
    draw.rectangle([90, 90, 210, 210], fill=NAVY_RGB)
    # Gold corner accent
    draw.rectangle([190, 90, 210, 110], fill=GOLD_RGB)

def draw_autonomy(img):
    """Single circle/complete self"""
    draw = ImageDraw.Draw(img)
    # Perfect circle in navy - self-contained
    draw.ellipse([75, 75, 225, 225], fill=NAVY_RGB)
    # Gold center point
    draw.ellipse([140, 140, 160, 160], fill=GOLD_RGB)

def draw_balance(img):
    """Symmetrical scales/yin-yang"""
    draw = ImageDraw.Draw(img)
    # Two balanced circles
    draw.ellipse([60, 120, 140, 200], fill=NAVY_RGB)
    draw.ellipse([160, 120, 240, 200], fill=GOLD_RGB)
    # Connecting line
    draw.line([(100, 160), (200, 160)], fill=NAVY_RGB, width=6)

def draw_beauty(img):
    """Graceful curve/flower petals"""
    draw = ImageDraw.Draw(img)
    # Petal-like overlapping circles in gold
    angles = [0, 72, 144, 216, 288]
    radius = 40
    for angle in angles:
        x = CENTER + int(radius * math.cos(math.radians(angle)))
        y = CENTER + int(radius * math.sin(math.radians(angle)))
        draw.ellipse([x-30, y-30, x+30, y+30], fill=GOLD_RGB)
    # Navy center
    draw.ellipse([CENTER-25, CENTER-25, CENTER+25, CENTER+25], fill=NAVY_RGB)

def draw_boldness(img):
    """Strong diagonal/lightning"""
    draw = ImageDraw.Draw(img)
    # Bold diagonal slash in gold
    draw.line([(80, 80), (220, 220)], fill=GOLD_RGB, width=25)
    # Navy accent
    draw.ellipse([70, 70, 90, 90], fill=NAVY_RGB)

def draw_challenge(img):
    """Mountain/upward arrow"""
    draw = ImageDraw.Draw(img)
    # Triangle peak in navy
    draw.polygon([(CENTER, 60), (100, 200), (200, 200)], fill=NAVY_RGB)
    # Gold summit
    draw.polygon([(CENTER, 60), (CENTER-20, 100), (CENTER+20, 100)], fill=GOLD_RGB)

def draw_citizenship(img):
    """Connected hexagons/community cell"""
    draw = ImageDraw.Draw(img)
    # Hexagon outline in navy
    points = []
    for i in range(6):
        angle = math.radians(60 * i)
        x = CENTER + 70 * math.cos(angle)
        y = CENTER + 70 * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, outline=NAVY_RGB, width=8)
    # Gold center
    draw.ellipse([CENTER-15, CENTER-15, CENTER+15, CENTER+15], fill=GOLD_RGB)

# Generate images
def generate_values_batch_1():
    """Generate first batch of value images"""
    values = {
        'achievement': draw_achievement,
        'adventure': draw_adventure,
        'authenticity': draw_authenticity,
        'authority': draw_authority,
        'autonomy': draw_autonomy,
        'balance': draw_balance,
        'beauty': draw_beauty,
        'boldness': draw_boldness,
        'challenge': draw_challenge,
        'citizenship': draw_citizenship,
    }

    for value_name, draw_func in values.items():
        img = create_base_canvas()
        draw_func(img)
        filepath = os.path.join(OUTPUT_DIR, f"{value_name}.png")
        img.save(filepath, 'PNG')
        print(f"✓ Generated {value_name}.png")

if __name__ == "__main__":
    generate_values_batch_1()
    print(f"\n✓ Generated batch 1: 10 value images")
