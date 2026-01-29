# Constants for Carbon Calculation (kg of CO2 per unit)
EMISSION_FACTORS = {
    'transport_bus': 0.10,   # kg per km saved vs car
    'transport_walk': 0.20,  # kg per km saved vs car
    'electricity': 0.85,     # kg per kWh saved
    'waste_recycled': 0.50,  # kg per kg of waste recycled
    'meat_free_meal': 1.50,  # kg per meal (vs high-carbon meal)
}

def calculate_impact(activity_type, quantity):
    factor = EMISSION_FACTORS.get(activity_type, 0)
    return round(factor * float(quantity), 2)