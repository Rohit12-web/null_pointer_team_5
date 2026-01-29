import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LogActivity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [formData, setFormData] = useState({
    type: initialType,
    subType: '',
    description: '',
    quantity: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activityTypes = [
    {
      id: 'transport',
      icon: '🚌',
      name: 'Transportation',
      description: 'Public transport, cycling, walking, carpooling',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      subTypes: [
        { id: 'public_transport', name: 'Public Transport', unit: 'km', impact: '0.14 kg CO₂/km saved' },
        { id: 'cycling', name: 'Cycling', unit: 'km', impact: '0.21 kg CO₂/km saved' },
        { id: 'walking', name: 'Walking', unit: 'km', impact: '0.21 kg CO₂/km saved' },
        { id: 'carpooling', name: 'Carpooling', unit: 'km', impact: '0.08 kg CO₂/km saved' },
        { id: 'electric_vehicle', name: 'Electric Vehicle', unit: 'km', impact: '0.10 kg CO₂/km saved' },
      ],
    },
    {
      id: 'electricity',
      icon: '💡',
      name: 'Energy Saving',
      description: 'Reduce electricity consumption',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
      subTypes: [
        { id: 'led_lights', name: 'Used LED Lights', unit: 'hours', impact: '0.04 kg CO₂/hour saved' },
        { id: 'unplug_devices', name: 'Unplugged Devices', unit: 'hours', impact: '0.02 kg CO₂/hour saved' },
        { id: 'ac_reduction', name: 'Reduced AC Usage', unit: 'hours', impact: '0.15 kg CO₂/hour saved' },
        { id: 'solar_energy', name: 'Used Solar Energy', unit: 'kWh', impact: '0.5 kg CO₂/kWh saved' },
        { id: 'natural_light', name: 'Used Natural Light', unit: 'hours', impact: '0.06 kg CO₂/hour saved' },
      ],
    },
    {
      id: 'recycling',
      icon: '♻️',
      name: 'Recycling & Waste',
      description: 'Reduce, reuse, and recycle waste',
      color: 'bg-green-50 border-green-200 hover:border-green-400',
      subTypes: [
        { id: 'plastic_recycling', name: 'Recycled Plastic', unit: 'items', impact: '0.5 kg CO₂/item saved' },
        { id: 'paper_recycling', name: 'Recycled Paper', unit: 'kg', impact: '1.0 kg CO₂/kg saved' },
        { id: 'composting', name: 'Composted Waste', unit: 'kg', impact: '0.3 kg CO₂/kg saved' },
        { id: 'reusable_bags', name: 'Used Reusable Bags', unit: 'times', impact: '0.1 kg CO₂ saved' },
        { id: 'reduced_packaging', name: 'Avoided Packaging', unit: 'items', impact: '0.2 kg CO₂/item saved' },
      ],
    },
    {
      id: 'water',
      icon: '💧',
      name: 'Water Conservation',
      description: 'Save and conserve water',
      color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      subTypes: [
        { id: 'shorter_shower', name: 'Shorter Shower', unit: 'minutes saved', impact: '10 liters/minute saved' },
        { id: 'fix_leaks', name: 'Fixed Leaks', unit: 'times', impact: '20 liters/day saved' },
        { id: 'rainwater', name: 'Collected Rainwater', unit: 'liters', impact: 'Direct water saved' },
        { id: 'efficient_washing', name: 'Full Load Washing', unit: 'loads', impact: '50 liters/load saved' },
        { id: 'turned_off_tap', name: 'Turned Off Tap', unit: 'times', impact: '12 liters saved' },
      ],
    },
    {
      id: 'food',
      icon: '🥗',
      name: 'Sustainable Food',
      description: 'Plant-based and local food choices',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
      subTypes: [
        { id: 'plant_based_meal', name: 'Plant-Based Meal', unit: 'meals', impact: '2.5 kg CO₂/meal saved' },
        { id: 'local_food', name: 'Bought Local Food', unit: 'items', impact: '0.5 kg CO₂/item saved' },
        { id: 'no_food_waste', name: 'Zero Food Waste', unit: 'meals', impact: '0.7 kg CO₂/meal saved' },
        { id: 'homegrown', name: 'Ate Homegrown Food', unit: 'meals', impact: '1.0 kg CO₂/meal saved' },
        { id: 'seasonal_food', name: 'Ate Seasonal Food', unit: 'meals', impact: '0.3 kg CO₂/meal saved' },
      ],
    },
    {
      id: 'other',
      icon: '🌳',
      name: 'Other Activities',
      description: 'Tree planting, eco drives, and more',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      subTypes: [
        { id: 'tree_planting', name: 'Planted a Tree', unit: 'trees', impact: '22 kg CO₂/year absorbed' },
        { id: 'eco_drive', name: 'Joined Eco Drive', unit: 'hours', impact: 'Community impact' },
        { id: 'awareness', name: 'Spread Awareness', unit: 'people', impact: 'Multiplied impact' },
        { id: 'cleanup', name: 'Cleanup Activity', unit: 'hours', impact: 'Environmental cleanup' },
        { id: 'donation', name: 'Eco Donation', unit: 'amount', impact: 'Supporting green causes' },
      ],
    },
  ];

  const selectedType = activityTypes.find((t) => t.id === formData.type);
  const selectedSubType = selectedType?.subTypes.find((s) => s.id === formData.subType);

  const handleTypeSelect = (typeId) => {
    setFormData({
      ...formData,
      type: typeId,
      subType: '',
      unit: '',
    });
  };

  const handleSubTypeSelect = (subTypeId) => {
    const subType = selectedType?.subTypes.find((s) => s.id === subTypeId);
    setFormData({
      ...formData,
      subType: subTypeId,
      unit: subType?.unit || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        type: '',
        subType: '',
        description: '',
        quantity: '',
        unit: '',
        date: new Date().toISOString().split('T')[0],
      });
    }, 2000);
  };

  const calculateImpact = () => {
    if (!selectedSubType || !formData.quantity) return null;
    // Simple estimation based on subtype
    const baseImpact = {
      transport: 0.15,
      electricity: 0.05,
      recycling: 0.4,
      water: 0.02,
      food: 1.5,
      other: 1.0,
    };
    const impact = (parseFloat(formData.quantity) * (baseImpact[formData.type] || 0.1)).toFixed(2);
    return impact;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Log Your Activity</h1>
          <p className="text-gray-600 mt-2">
            Record your eco-friendly actions and see your impact grow 🌱
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl flex items-center justify-center space-x-2 animate-pulse">
            <span className="text-2xl">✅</span>
            <span className="font-medium">Activity logged successfully! +{calculateImpact() || 10} points earned!</span>
          </div>
        )}

        {/* Activity Type Selection */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Select Activity Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activityTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.type === type.id
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : type.color
                }`}
              >
                <span className="text-3xl block mb-2">{type.icon}</span>
                <h3 className="font-semibold text-gray-800">{type.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-type Selection */}
        {formData.type && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. What did you do?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedType?.subTypes.map((subType) => (
                <button
                  key={subType.id}
                  onClick={() => handleSubTypeSelect(subType.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.subType === subType.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-800">{subType.name}</h3>
                  <p className="text-sm text-green-600 mt-1">{subType.impact}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activity Details Form */}
        {formData.subType && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Activity Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity ({selectedSubType?.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={`Enter ${selectedSubType?.unit}`}
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add any notes about this activity..."
                />
              </div>
            </div>

            {/* Impact Preview */}
            {formData.quantity && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Estimated Impact</h3>
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      {calculateImpact()} kg
                    </span>
                    <span className="text-gray-600 ml-1">CO₂ saved</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      +{Math.round(parseFloat(formData.quantity) * 5)}
                    </span>
                    <span className="text-gray-600 ml-1">points</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging Activity...</span>
                </span>
              ) : (
                'Log Activity 🌿'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LogActivity;
