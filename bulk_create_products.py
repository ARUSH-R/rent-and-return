import requests
import random
import string

API_URL = "http://localhost:8080/api/products"
CATEGORIES = [
    "Electronics",
    "Vehicles",
    "Books & Stationery",
    "Sports & Fitness",
    "Home Appliances",
    "Furniture",
    "Tools & Equipment",
    "Services"
]
NUM_PRODUCTS_PER_CATEGORY = 30
NUM_IMAGES = 200

# Example product names for each category
PRODUCT_NAMES = {
    "Electronics": ["Laptop", "Camera", "Tablet", "Smartphone", "Headphones", "Speaker", "Monitor", "Projector", "Printer", "Router", "Smartwatch", "VR Headset", "Microphone", "Drone", "Power Bank", "E-Reader", "Webcam", "Graphics Card", "Game Console", "Bluetooth Adapter"],
    "Vehicles": ["Mountain Bike", "Scooter", "Car", "Motorbike", "Electric Bike", "Skateboard", "Rollerblades", "SUV", "Convertible", "Truck", "Van", "Road Bike", "Hybrid Bike", "Pickup Truck", "Minivan", "Cargo Bike", "Sports Car", "Electric Scooter", "Moped", "ATV"],
    "Books & Stationery": ["Textbook", "Notebook", "Novel", "Pen Set", "Highlighter Pack", "Calculator", "Dictionary", "Atlas", "Sketchbook", "Binder", "Folder", "Sticky Notes", "Planner", "Journal", "Graph Paper", "Ruler Set", "Eraser Pack", "Stapler", "Clipboard", "Index Cards"],
    "Sports & Fitness": ["Football", "Tennis Racket", "Yoga Mat", "Dumbbells", "Treadmill", "Basketball", "Cricket Bat", "Badminton Set", "Jump Rope", "Resistance Bands", "Golf Clubs", "Boxing Gloves", "Swim Goggles", "Hockey Stick", "Baseball Glove", "Elliptical Trainer", "Rowing Machine", "Pull-up Bar", "Exercise Bike", "Kettlebell"],
    "Home Appliances": ["Microwave", "Refrigerator", "Washing Machine", "Air Conditioner", "Heater", "Vacuum Cleaner", "Blender", "Toaster", "Coffee Maker", "Dishwasher", "Water Purifier", "Iron", "Fan", "Rice Cooker", "Oven", "Juicer", "Food Processor", "Induction Cooktop", "Geyser", "Mixer Grinder"],
    "Furniture": ["Office Chair", "Desk", "Bookshelf", "Sofa", "Dining Table", "Bed", "Wardrobe", "Coffee Table", "TV Stand", "Recliner", "Futon", "Dresser", "Nightstand", "Bar Stool", "Shoe Rack", "Filing Cabinet", "Bean Bag", "Rocking Chair", "Patio Set", "Cupboard"],
    "Tools & Equipment": ["Drill Machine", "Hammer", "Screwdriver Set", "Ladder", "Saw", "Wrench Set", "Measuring Tape", "Toolbox", "Chainsaw", "Angle Grinder", "Sander", "Paint Sprayer", "Tile Cutter", "Wheelbarrow", "Pipe Wrench", "Socket Set", "Pliers", "Chisel Set", "Level", "Stud Finder"],
    "Services": ["Event Planning", "Cleaning Service", "Moving Help", "Tutoring", "Photography", "Catering", "DJ Service", "Gardening", "Babysitting", "Pet Sitting", "Laundry Service", "Car Wash", "Home Repair", "Personal Training", "Makeup Artist", "Interior Design", "Language Lessons", "Music Lessons", "Tech Support", "Bike Repair"]
}

def random_description(category, name):
    return f"Rent a high-quality {name} for your needs in the {category.lower()} category. Well-maintained, reliable, and available at an affordable daily rate!"

def random_price():
    return round(random.uniform(50, 2000), 2)

def random_stock():
    return random.randint(1, 20)

def random_user():
    # Simulate a user/admin for createdBy/updatedBy
    return random.choice(["admin", "system", "demo_user", "testuser"])

def main():
    image_counter = 1
    total_created = 0
    for category in CATEGORIES:
        names = PRODUCT_NAMES[category]
        for i in range(NUM_PRODUCTS_PER_CATEGORY):
            name = random.choice(names) + f" {random.randint(1, 1000)}"
            description = random_description(category, name)
            price = random_price()
            stock = random_stock()
            image_url = f"/assets/products/{image_counter}.jpg"
            created_by = random_user()
            updated_by = created_by
            product = {
                "name": name,
                "description": description,
                "pricePerDay": price,
                "stock": stock,
                "category": category,
                "imageUrl": image_url,
                "available": True,
                "deleted": False,
                "createdBy": created_by,
                "updatedBy": updated_by
            }
            try:
                resp = requests.post(API_URL, json=product)
                if resp.status_code == 200 or resp.status_code == 201:
                    print(f"Created: {name} in {category}")
                    total_created += 1
                else:
                    print(f"Failed to create {name}: {resp.status_code} {resp.text}")
            except Exception as e:
                print(f"Error creating {name}: {e}")
            image_counter += 1
            if image_counter > NUM_IMAGES:
                image_counter = 1
    print(f"Total products created: {total_created}")

if __name__ == "__main__":
    main() 