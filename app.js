const inputs = document.querySelectorAll(".item-qty, .topping-qty, #setMeal, .rice-qty");
inputs.forEach((input) => input.addEventListener("change", calculateTotal));
inputs.forEach((input) => input.addEventListener("input", calculateTotal));

function calculateTotal() {
    let total = 0;
    let summaryHTML = '<ul class="list-group list-group-flush">';

    // 1. Calculate Ramen Base
    document.querySelectorAll(".item-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${name} x${qty} <span>¥${(price * qty).toFixed(0)}</span></li>`;
        }
    });

    // 2. Calculate Toppings 
    document.querySelectorAll(".topping-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">トッピング: ${name} x${qty} <span>¥${(price * qty).toFixed(0)}</span></li>`;
        }
    });

    // 3. Calculate Set
    let setSelect = document.getElementById("setMeal");
    let selectedSet = setSelect.options[setSelect.selectedIndex];
    if (selectedSet.value) {
        let price = parseFloat(selectedSet.getAttribute("data-price"));
        total += price;
        summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${selectedSet.value} <span>¥${price.toFixed(0)}</span></li>`;
    }

    // 4. Calculate Rice (Multi-select)
    document.querySelectorAll(".rice-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${name} x${qty} <span>¥ ${(price * qty).toFixed(0)}</span></li>`;
        }
    });

    summaryHTML += "</ul>";

    if (total === 0) {
        document.getElementById("summaryContent").innerHTML = '<p class="text-muted">注文内容を追加してください。</p>';
    } else {
        document.getElementById("summaryContent").innerHTML = summaryHTML;
    }

    document.getElementById("totalPrice").innerText = `¥${total.toFixed(0)}`;
    return total;
}

function submitOrder() {
    const name = document.getElementById("custName").value;
    const table = document.getElementById("tableNum").value;

    if (!name || !table) {
        alert("名前とテーブル番号を入力してください。");
        return;
    }

    let orderItems = [];

    // Gather items
    document.querySelectorAll(".item-qty").forEach((el) => {
        if (parseInt(el.value) > 0) {
            orderItems.push(`${el.getAttribute("data-name")} (x${el.value})`);
        }
    });

    document.querySelectorAll(".topping-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            orderItems.push(`Topping: ${el.getAttribute("data-name")} (x${qty})`);
        }
    });

    let setVal = document.getElementById("setMeal").value;
    if (setVal) orderItems.push(setVal);

    document.querySelectorAll(".rice-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            orderItems.push(`${el.getAttribute("data-name")} (x${qty})`);
        }
    });

    if (orderItems.length === 0) {
        alert("注文内容が空です。何かを選択してください。");
        return;
    }

    const payload = {
        customerName: name,
        tableNumber: table,
        items: orderItems,
        totalPrice: calculateTotal(),
    };

    // Post to local Java Backend
    fetch("http://localhost:8080/api/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((res) => res.text())
    .then((data) => {
        alert("Success: " + data);
        document.getElementById("orderForm").reset();
        calculateTotal();
    })
    .catch((err) => {
        console.error(err);
        alert("注文完了しました。");
    });
}

function clearEntireOrder() {
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
        orderForm.reset();
    }
    calculateTotal();
}