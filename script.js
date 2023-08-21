const componentPrices = {
    cpu: 100,
    gpu: 200,
    ram: 50,
    storage: 200,
    motherboard: 500,
    psu: 40,
    cooling: 55,
    case: 30,
    peripherals: 67,
    os: 150
};

document.getElementById("submit-button").addEventListener("click", function () {
    const firstName = document.getElementById("first-name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const dob = new Date(document.getElementById("dob").value);
    const currentDate = new Date();

    const ageDiff = currentDate.getFullYear() - dob.getFullYear();
    const isUnder18 = ageDiff < 18;

    if (isUnder18) {
        alert("You must be at least 18 years old to place an order.");
        return;
    }

    const componentQuantities = {};
    const selectedComponents = Array.from(document.getElementById("components").options)
        .filter(option => option.selected)
        .map(option => {
            const component = option.value;
            const quantity = parseInt(document.getElementById(`quantity-${component}`).value);
            componentQuantities[component] = quantity;
            return component;
        });

    const selectedCity = document.getElementById("city").value;

    let totalPrice = 0;
    selectedComponents.forEach(component => {
        const quantity = componentQuantities[component];
        const price = componentPrices[component];
        totalPrice += price * quantity;
    });

    let confirmationMessage = `Thank you, ${firstName} ${surname}! You have successfully submitted your order.\n\n`;
    confirmationMessage += "Order Details:\n";
    selectedComponents.forEach(component => {
        confirmationMessage += `${component} - Quantity: ${componentQuantities[component]}\n`;
    });
    confirmationMessage += `Selected City in Germany: ${selectedCity}\n`;
    confirmationMessage += `Address: ${address}\n`;
    confirmationMessage += `Date of Birth: ${dob.toDateString()}\n`;
    confirmationMessage += `Total Price: €${totalPrice}`;

    alert(confirmationMessage);

    resetForm();
});

document.getElementById("components").addEventListener("change", function () {
    const selectedComponents = Array.from(this.options)
        .filter(option => option.selected)
        .map(option => option.value);

    let quantitiesHTML = '';
    let totalPrice = 0;

    selectedComponents.forEach(component => {
        const price = componentPrices[component];
        const storedQuantity = getStoredQuantity(component);
        
        quantitiesHTML += `
            <div>
                <label for="quantity-${component}">${component} Quantity:</label>
                <input type="number" id="quantity-${component}" name="quantity-${component}" min="1" value="${storedQuantity}" onchange="updateTotalPrice()">
                <span class="component-price">€${price * storedQuantity}</span>
            </div>
        `;

        totalPrice += price * storedQuantity;
    });

    document.getElementById("component-quantities").innerHTML = quantitiesHTML;
    document.getElementById("total-price").textContent = `Total Price: €${totalPrice}`;
});

function getStoredQuantity(component) {
    const storedQuantityInput = document.querySelector(`#quantity-${component}`);
    return storedQuantityInput ? parseInt(storedQuantityInput.value) : 1;
}

function updateTotalPrice() {
    const selectedComponents = Array.from(document.getElementById("components").options)
        .filter(option => option.selected)
        .map(option => option.value);

    let totalPrice = 0;
    selectedComponents.forEach(component => {
        const quantity = parseInt(document.getElementById(`quantity-${component}`).value);
        const price = componentPrices[component];
        totalPrice += price * quantity;
        document.querySelector(`#quantity-${component} + .component-price`).textContent = `€${price * quantity}`;
    });

    document.getElementById("total-price").textContent = `Total Price: €${totalPrice}`;
}

function resetForm() {
    document.getElementById("order-form").reset();
    document.getElementById("component-quantities").innerHTML = '';
    document.getElementById("total-price").textContent = 'Total Price: €0';
}