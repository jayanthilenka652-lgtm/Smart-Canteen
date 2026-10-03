/**
 * Smart Canteen AI Service (Rule-Based Mock AI)
 * Provides intelligent food recommendations, peak wait time predictions,
 * and nutritional combo suggestions without requiring external API keys.
 */

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Get personalized smart meal recommendations based on student preferences & budget
   */
  async getSmartMealRecommendations(preference = 'balanced', maxBudget = 150) {
    await delay(800);

    const recommendations = [
      {
        id: 'rec_1',
        title: 'Energy Breakfast Combo',
        category: 'Breakfast',
        matchPercentage: 96,
        reason: 'Optimal protein and carbs for morning lectures under your budget limit.',
        items: ['Masala Dosa', 'Fresh Lime Juice'],
        estimatedCost: 85,
        calories: '420 kcal',
        prepTime: '10 mins'
      },
      {
        id: 'rec_2',
        title: 'Campus Royal Lunch Feast',
        category: 'Lunch',
        matchPercentage: 95,
        reason: 'Most popular student favorite with high rating and delicious authentic spices.',
        items: ['Veg Biryani', 'Buttermilk'],
        estimatedCost: 130,
        calories: '550 kcal',
        prepTime: '15 mins'
      },
      {
        id: 'rec_3',
        title: 'Quick Break Snack Pack',
        category: 'Snacks',
        matchPercentage: 90,
        reason: 'Ideal for 15-minute class breaks with fast preparation time.',
        items: ['Veg Sandwich', 'Cold Coffee'],
        estimatedCost: 110,
        calories: '480 kcal',
        prepTime: '10 mins'
      }
    ];

    return {
      success: true,
      data: recommendations.filter(r => r.estimatedCost <= maxBudget)
    };
  },

  /**
   * Predict slot prep time & queue traffic score based on selected slot
   */
  async predictSlotWaitTime(slotTime, itemQuantity = 2) {
    await delay(600);

    const isPeakHour = slotTime.includes('12:30') || slotTime.includes('01:00') || slotTime.includes('12:15');
    const estimatedMinutes = isPeakHour ? 8 + itemQuantity * 2 : 3 + itemQuantity;
    const congestionLevel = isPeakHour ? 'Moderate to High' : 'Low Traffic (Fast Pickup)';

    return {
      success: true,
      data: {
        slotTime,
        estimatedMinutes,
        congestionLevel,
        aiTip: isPeakHour
          ? '🔥 Peak lunch rush detected! Pre-ordering now saves you ~15 minutes of physical queueing.'
          : '⚡ Fast pickup slot! Kitchen workload is light right now.'
      }
    };
  },

  /**
   * Suggest smart complementary items for items in the student's cart
   */
  async suggestSmartCombos(cartItems = []) {
    await delay(700);

    const categoriesInCart = cartItems.map(i => i.category);
    let suggestion = null;

    if (!categoriesInCart.includes('Drinks')) {
      suggestion = {
        name: 'Cold Coffee',
        price: 50,
        reason: '84% of students pair hot canteen meals with a refreshing chilled Cold Coffee!'
      };
    } else {
      suggestion = {
        name: 'Samosa',
        price: 25,
        reason: 'Add a crispy golden Samosa to complete your snack break!'
      };
    }

    return {
      success: true,
      data: suggestion
    };
  },

  /**
   * AI Assistant Q&A for Canteen menu queries
   */
  async answerCanteenQuery(query) {
    await delay(900);

    const q = query.toLowerCase();
    let response = '';

    if (q.includes('biryani') || q.includes('lunch') || q.includes('rice')) {
      response = 'Our Veg Biryani (₹110) and Chicken Biryani (₹150) are slow-cooked with basmati rice and are top student picks!';
    } else if (q.includes('healthy') || q.includes('light') || q.includes('diet') || q.includes('breakfast')) {
      response = 'Idli Sambar (₹40) and Masala Dosa (₹60) are nutritious, steamed/roasted campus favorites.';
    } else if (q.includes('quick') || q.includes('fast') || q.includes('snack')) {
      response = 'Samosa (₹25), French Fries (₹50), and Mirchi Bajji (₹30) have the quickest prep times!';
    } else {
      response = 'Smart Canteen AI recommends trying our freshly made South Indian Breakfast or Lunch Biryani!';
    }

    return {
      success: true,
      answer: response
    };
  }
};
