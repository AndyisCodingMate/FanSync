// script.js
const stripe = Stripe('pk_test_your_publishable_key');
const elements = stripe.elements();

// Initialize quantities and prices for each section
const sections = {
    A: { price: 100, available: 20, quantity: 0 },
    B: { price: 80, available: 20, quantity: 0 },
    C: { price: 60, available: 20, quantity: 0 },
    D: { price: 40, available: 20, quantity: 0 }
};

// Create card Element with custom styling
const cardStyle = {
    base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

const card = elements.create('card', { style: cardStyle });
card.mount('#card-element');

// Handle real-time validation errors
card.addEventListener('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

function calculateTotal() {
    return Object.entries(sections).reduce((total, [section, data]) => {
        return total + (data.quantity * data.price);
    }, 0);
}

function updateDisplay(section) {
    // Update quantity display
    document.getElementById(`quantity-${section}`).textContent = sections[section].quantity;
    // Update available seats
    document.getElementById(`available-${section}`).textContent = sections[section].available;
    // Update total amount
    document.getElementById('total-amount').textContent = calculateTotal();
}

function increaseQuantity(section) {
    if (sections[section].available > 0) {
        sections[section].quantity++;
        sections[section].available--;
        updateDisplay(section);
    } else {
        alert(`Section ${section} is sold out!`);
    }
}

function decreaseQuantity(section) {
    if (sections[section].quantity > 0) {
        sections[section].quantity--;
        sections[section].available++;
        updateDisplay(section);
    }
}

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const totalAmount = calculateTotal();
    
    if (totalAmount === 0) {
        alert('Please select at least one ticket');
        return;
    }

    // Create a summary of the purchase
    const purchaseSummary = Object.entries(sections)
        .filter(([_, data]) => data.quantity > 0)
        .map(([section, data]) => 
            `Section ${section}: ${data.quantity} tickets at $${data.price} each`
        ).join('\n');

    // Show confirmation dialog
    const confirmPurchase = confirm(
        `Purchase Summary:\n${purchaseSummary}\n\nTotal: $${totalAmount}\n\nProceed with purchase?`
    );

    if (confirmPurchase) {
        try {
            // Mock successful payment
            alert('Test Payment Successful!\n\nThis is a mock implementation.\n' + 
                  'In a real application, this would process through Stripe.');
            
            // Reset quantities after successful purchase
            Object.keys(sections).forEach(section => {
                sections[section].quantity = 0;
                updateDisplay(section);
            });
            
        } catch (error) {
            document.getElementById('card-errors').textContent = error.message;
        }
    }
});

// Initialize displays for all sections
Object.keys(sections).forEach(section => updateDisplay(section));

// Add keyboard support for quantity controls
document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    if (activeElement.closest('.quantity-control')) {
        const section = activeElement.closest('.section-box').querySelector('h3').textContent.slice(-1);
        if (event.key === 'ArrowUp') {
            increaseQuantity(section);
        } else if (event.key === 'ArrowDown') {
            decreaseQuantity(section);
        }
    }
});
