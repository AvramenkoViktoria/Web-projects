document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.querySelector('.search-button');
    const inputField = document.querySelector('input[type="text"]');
    const productContainer = document.querySelector('.product-list');
    const infoPanel = document.querySelector('.info-panel');

    const initialProducts = [
        { name: 'Помідори', quantity: 2, purchased: true },
        { name: 'Яблука', quantity: 2, purchased: false },
        { name: 'Сир', quantity: 1, purchased: false }
    ];

    initialProducts.forEach(product => addProductToDOM(product.name, product.quantity, product.purchased));

    addButton.addEventListener('click', () => {
        const productName = inputField.value.trim();
        if (productName) {
            addProductToDOM(productName, 1, false);
            inputField.value = '';
            inputField.focus();
        }
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    function addProductToDOM(name, quantity, purchased) {
        const productItem = document.createElement('div');
        productItem.classList.add('container', 'product-item');
        if (purchased) productItem.classList.add('purchased');

        const productName = document.createElement('div');
        productName.classList.add('product-name');
        productName.textContent = name;

        if (!purchased) {
            productName.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = name;
                input.classList.add('edit-input');
                input.style.width = '25%'; // Устанавливаем ширину 25% от контейнера
                productName.replaceWith(input);
                input.focus();

                input.addEventListener('blur', () => {
                    const newName = input.value.trim();
                    if (newName) {
                        productName.textContent = newName;
                    }
                    input.replaceWith(productName);
                    updateInfoPanel();
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            });
        }

        if (purchased) productName.classList.add('crossed');

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');
        const quantityDiv = document.createElement('div');
        quantityDiv.classList.add('quantity');
        quantityDiv.textContent = quantity;
        quantityContainer.appendChild(quantityDiv);

        if (!purchased) {
            const minusButton = document.createElement('button');
            minusButton.classList.add('minus-button');
            minusButton.textContent = '-';
            minusButton.dataset.tooltip = 'Зменшити';
            minusButton.disabled = quantity <= 1;
            minusButton.addEventListener('click', () => {
                if (quantityDiv.textContent > 1) {
                    quantityDiv.textContent--;
                    if (quantityDiv.textContent <= 1) {
                        minusButton.disabled = true;
                    }
                }
                updateInfoPanel();
            });

            const plusButton = document.createElement('button');
            plusButton.classList.add('plus-button');
            plusButton.textContent = '+';
            plusButton.dataset.tooltip = 'Збільшити';
            plusButton.addEventListener('click', () => {
                quantityDiv.textContent++;
                if (quantityDiv.textContent > 1) {
                    minusButton.disabled = false;
                }
                updateInfoPanel();
            });

            quantityContainer.insertBefore(minusButton, quantityDiv);
            quantityContainer.appendChild(plusButton);
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buyButton = document.createElement('button');
        buyButton.classList.add('buy-button');
        buyButton.textContent = purchased ? 'Куплено' : 'Не куплено';
        buyButton.dataset.tooltip = purchased ? 'Куплено' : 'Не куплено';
        buyButton.addEventListener('click', () => {
            if (productItem.classList.contains('purchased')) {
                productItem.classList.remove('purchased');
                productName.classList.remove('crossed');
                buyButton.textContent = 'Не куплено';
                buyButton.dataset.tooltip = 'Не куплено';
                addQuantityButtons(quantityContainer, quantityDiv);

                const crossButton = document.createElement('button');
                crossButton.classList.add('cross-button');
                crossButton.textContent = '×';
                crossButton.dataset.tooltip = 'Відмінити';
                crossButton.addEventListener('click', () => {
                    productContainer.removeChild(productItem);
                    updateInfoPanel();
                });
                buttonContainer.appendChild(crossButton);
            } else {
                productItem.classList.add('purchased');
                productName.classList.add('crossed');
                buyButton.textContent = 'Куплено';
                buyButton.dataset.tooltip = 'Куплено';
                removeQuantityButtons(quantityContainer);
                if (buttonContainer.querySelector('.cross-button')) {
                    buttonContainer.removeChild(buttonContainer.querySelector('.cross-button'));
                }
            }
            updateInfoPanel();
        });

        buttonContainer.appendChild(buyButton);

        if (!purchased) {
            const crossButton = document.createElement('button');
            crossButton.classList.add('cross-button');
            crossButton.textContent = '×';
            crossButton.dataset.tooltip = 'Відмінити';
            crossButton.addEventListener('click', () => {
                productContainer.removeChild(productItem);
                updateInfoPanel();
            });
            buttonContainer.appendChild(crossButton);
        }

        productItem.appendChild(productName);
        productItem.appendChild(quantityContainer);
        productItem.appendChild(buttonContainer);

        productContainer.appendChild(productItem);
        updateInfoPanel();
    }

    function addQuantityButtons(container, quantityDiv) {
        const minusButton = document.createElement('button');
        minusButton.classList.add('minus-button');
        minusButton.textContent = '-';
        minusButton.dataset.tooltip = 'Зменшити';
        minusButton.disabled = quantityDiv.textContent <= 1;
        minusButton.addEventListener('click', () => {
            if (quantityDiv.textContent > 1) {
                quantityDiv.textContent--;
                if (quantityDiv.textContent <= 1) {
                    minusButton.disabled = true;
                }
                updateInfoPanel();
            }
        });

        const plusButton = document.createElement('button');
        plusButton.classList.add('plus-button');
        plusButton.textContent = '+';
        plusButton.dataset.tooltip = 'Збільшити';
        plusButton.addEventListener('click', () => {
            quantityDiv.textContent++;
            if (quantityDiv.textContent > 1) {
                minusButton.disabled = false;
            }
            updateInfoPanel();
        });

        container.insertBefore(minusButton, quantityDiv);
        container.appendChild(plusButton);
    }

    function removeQuantityButtons(container) {
        const plusButtons = container.querySelectorAll('.plus-button');
        const minusButtons = container.querySelectorAll('.minus-button');

        plusButtons.forEach(button => button.remove());
        minusButtons.forEach(button => button.remove());
    }

    function updateInfoPanel() {
        const remainingPanel = infoPanel.querySelector('.remaining-products');
        const purchasedPanel = infoPanel.querySelector('.bought-products');

        remainingPanel.innerHTML = '';
        purchasedPanel.innerHTML = '';

        const productItems = document.querySelectorAll('.product-item');

        productItems.forEach(item => {
            const productName = item.querySelector('.product-name') ? item.querySelector('.product-name').textContent : item.querySelector('.edit-input').value;
            const quantity = item.querySelector('.quantity').textContent;

            const productSpan = document.createElement('span');
            productSpan.classList.add('product');

            const amountSpan = document.createElement('span');
            amountSpan.classList.add('amount');
            amountSpan.textContent = quantity;

            productSpan.textContent = productName;

            if (item.classList.contains('purchased')) {
                productSpan.classList.add('crossed');
                amountSpan.classList.add('crossed');
                purchasedPanel.appendChild(productSpan);
                productSpan.appendChild(amountSpan);
            } else {
                remainingPanel.appendChild(productSpan);
                productSpan.appendChild(amountSpan);
            }
        });
    }
});