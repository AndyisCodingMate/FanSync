// script.js
const stripe = Stripe('your_publishable_test_key');
const elements = stripe.elements();

// Initialize quantities
const sections = ['A', 'B', 'C', 'D'];
const quantities = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
};
const available = {
    A: 20,
    B: 20,
    C: 20,
    D: 20
};
const PRICE_PER_TICKET = 10; // Test price in dollars

// Create card Element
const card = elements.create('card');
card.mount('#card-element');

function updateDisplay(section) {
    document.getElementById(`quantity-${section}`).textContent = quantities[section];
    document.getElementById(`available-${section}`).textContent = available[section];
    updateTotal();
}

function updateTotal() {
    const total = Object.values(quantities).reduce((sum, qty) => sum + qty, 0) * PRICE_PER_TICKET;
    document.getElementById('total-amount').textContent = total;
}

function increaseQuantity(section) {
    if (available[section] > 0) {
        quantities[section]++;
        available[section]--;
        updateDisplay(section);
    }
}

function decreaseQuantity(section) {
    if (quantities[section] > 0) {
        quantities[section]--;
        available[section]++;
        updateDisplay(section);
    }
}

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const totalAmount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0) * PRICE_PER_TICKET;

    if (totalAmount === 0) {
        alert('Please select at least one ticket');
        return;
    }

    // For testing, we'll just show a success message
    alert('Test Payment Successful! This is a mock implementation.');
    
    // In a real implementation, you would:
    // 1. Send request to your backend
    // 2. Create a payment intent
    // 3. Confirm the payment
    // 4. Handle the response
});

// Initialize displays
sections.forEach(section => updateDisplay(section));
