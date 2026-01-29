from django.core.management.base import BaseCommand
from api.models import Badge, GreenAction

class Command(BaseCommand):
    help = 'Seed initial data for badges and green actions'

    def handle(self, *args, **options):
        # Create badges
        badges_data = [
            {
                'name': 'First Steps',
                'slug': 'first_steps',
                'description': 'Welcome to LeafIt! You\'ve taken your first step towards a greener future.',
                'icon': '🌱',
                'points_required': 0,
                'category': 'milestone'
            },
            {
                'name': 'Week Warrior',
                'slug': 'week_warrior',
                'description': 'Maintained a 7-day streak of eco-friendly activities!',
                'icon': '🔥',
                'points_required': 100,
                'category': 'streak'
            },
            {
                'name': 'Recycling Pro',
                'slug': 'recycler',
                'description': 'Logged 10 recycling activities. Keep up the great work!',
                'icon': '♻️',
                'points_required': 200,
                'category': 'activity'
            },
            {
                'name': 'Energy Saver',
                'slug': 'energy_saver',
                'description': 'Saved over 50kg of CO₂ through energy-saving activities.',
                'icon': '💡',
                'points_required': 300,
                'category': 'milestone'
            },
            {
                'name': 'Water Guardian',
                'slug': 'water_guardian',
                'description': 'Completed 20 water-saving activities.',
                'icon': '💧',
                'points_required': 250,
                'category': 'activity'
            },
            {
                'name': 'Eco Champion',
                'slug': 'eco_champion',
                'description': 'Reached 1000 eco points! You\'re making a real difference.',
                'icon': '🏆',
                'points_required': 1000,
                'category': 'milestone'
            },
            {
                'name': 'Month Master',
                'slug': 'month_master',
                'description': 'Maintained a 30-day streak! Incredible dedication!',
                'icon': '⭐',
                'points_required': 500,
                'category': 'streak'
            },
            {
                'name': 'Plant Parent',
                'slug': 'plant_parent',
                'description': 'Logged 5 plant-based meal activities.',
                'icon': '🌿',
                'points_required': 150,
                'category': 'activity'
            },
            {
                'name': 'Green Commuter',
                'slug': 'green_commuter',
                'description': 'Chose eco-friendly transport 15 times.',
                'icon': '🚲',
                'points_required': 350,
                'category': 'activity'
            },
            {
                'name': 'Climate Hero',
                'slug': 'climate_hero',
                'description': 'Saved over 100kg of CO₂. You\'re a climate hero!',
                'icon': '🌍',
                'points_required': 750,
                'category': 'milestone'
            },
        ]

        for badge_data in badges_data:
            Badge.objects.get_or_create(
                slug=badge_data['slug'],
                defaults=badge_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(badges_data)} badges'))

        # Create green actions
        actions_data = [
            # Recycling
            {'title': 'Recycle Paper', 'description': 'Recycled paper products', 'points': 10, 'co2_saved': 0.5, 'category': 'Recycling', 'icon': '📄'},
            {'title': 'Recycle Plastic', 'description': 'Recycled plastic items', 'points': 15, 'co2_saved': 0.8, 'category': 'Recycling', 'icon': '🥤'},
            {'title': 'Recycle Glass', 'description': 'Recycled glass containers', 'points': 12, 'co2_saved': 0.6, 'category': 'Recycling', 'icon': '🍾'},
            {'title': 'Recycle Electronics', 'description': 'Properly disposed of e-waste', 'points': 25, 'co2_saved': 2.0, 'category': 'Recycling', 'icon': '📱'},
            
            # Energy
            {'title': 'Turn Off Lights', 'description': 'Turned off lights when leaving a room', 'points': 5, 'co2_saved': 0.2, 'category': 'Energy', 'icon': '💡'},
            {'title': 'Unplug Devices', 'description': 'Unplugged unused electronic devices', 'points': 8, 'co2_saved': 0.3, 'category': 'Energy', 'icon': '🔌'},
            {'title': 'Use LED Bulbs', 'description': 'Replaced regular bulbs with LED', 'points': 20, 'co2_saved': 1.5, 'category': 'Energy', 'icon': '💡'},
            {'title': 'Air Dry Clothes', 'description': 'Air dried clothes instead of using dryer', 'points': 15, 'co2_saved': 1.2, 'category': 'Energy', 'icon': '👕'},
            
            # Water
            {'title': 'Shorter Shower', 'description': 'Took a shower under 5 minutes', 'points': 10, 'co2_saved': 0.4, 'category': 'Water', 'icon': '🚿'},
            {'title': 'Fix Leaky Faucet', 'description': 'Fixed a leaky faucet', 'points': 25, 'co2_saved': 1.0, 'category': 'Water', 'icon': '🔧'},
            {'title': 'Use Reusable Bottle', 'description': 'Used a reusable water bottle', 'points': 8, 'co2_saved': 0.3, 'category': 'Water', 'icon': '🍶'},
            {'title': 'Collect Rainwater', 'description': 'Collected rainwater for plants', 'points': 15, 'co2_saved': 0.5, 'category': 'Water', 'icon': '🌧️'},
            
            # Transport
            {'title': 'Walk Instead of Drive', 'description': 'Walked instead of driving', 'points': 15, 'co2_saved': 2.0, 'category': 'Transport', 'icon': '🚶'},
            {'title': 'Bike to Work', 'description': 'Cycled instead of driving', 'points': 20, 'co2_saved': 3.0, 'category': 'Transport', 'icon': '🚲'},
            {'title': 'Use Public Transport', 'description': 'Used bus or train instead of car', 'points': 12, 'co2_saved': 1.5, 'category': 'Transport', 'icon': '🚌'},
            {'title': 'Carpool', 'description': 'Shared a ride with others', 'points': 15, 'co2_saved': 2.5, 'category': 'Transport', 'icon': '🚗'},
            
            # Food
            {'title': 'Plant-Based Meal', 'description': 'Ate a plant-based meal', 'points': 15, 'co2_saved': 2.5, 'category': 'Food', 'icon': '🥗'},
            {'title': 'Reduce Food Waste', 'description': 'Composted food scraps', 'points': 10, 'co2_saved': 0.8, 'category': 'Food', 'icon': '🍂'},
            {'title': 'Buy Local Produce', 'description': 'Bought locally grown food', 'points': 12, 'co2_saved': 1.0, 'category': 'Food', 'icon': '🥕'},
            {'title': 'Bring Own Shopping Bag', 'description': 'Used reusable shopping bags', 'points': 8, 'co2_saved': 0.2, 'category': 'Food', 'icon': '👜'},
            
            # Other
            {'title': 'Plant a Tree', 'description': 'Planted a tree or plant', 'points': 50, 'co2_saved': 10.0, 'category': 'Nature', 'icon': '🌳'},
            {'title': 'Use Cloth Napkins', 'description': 'Used cloth napkins instead of paper', 'points': 5, 'co2_saved': 0.1, 'category': 'Lifestyle', 'icon': '🧻'},
            {'title': 'Paperless Billing', 'description': 'Switched to paperless billing', 'points': 10, 'co2_saved': 0.5, 'category': 'Lifestyle', 'icon': '📧'},
            {'title': 'Second-Hand Purchase', 'description': 'Bought second-hand items', 'points': 20, 'co2_saved': 3.0, 'category': 'Lifestyle', 'icon': '👗'},
        ]

        for action_data in actions_data:
            GreenAction.objects.get_or_create(
                title=action_data['title'],
                defaults=action_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(actions_data)} green actions'))
