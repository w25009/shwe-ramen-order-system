// 💡 監視対象の入力フィールドを新しいセットメニューとドリンクのID/クラスに更新
const inputs = document.querySelectorAll(".item-qty, .topping-qty, #set-chashudon, #set-gyoza, #set-hancha, .rice-qty, .drink-qty");
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
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>${name} x${qty}</div>
                    <div>
                        <span class="me-3">¥${(price * qty).toFixed(0)}</span>
                        <button type="button" class="btn btn-sm text-danger p-0 border-0" onclick="deleteSingleItem('${el.id || el.className}')">❌</button>
                    </div>
                </li>`;
        }
    });

    // 2. Calculate Toppings 
    document.querySelectorAll(".topping-qty").forEach((el, index) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>トッピング: ${name} x${qty}</div>
                    <div>
                        <span class="me-3">¥${(price * qty).toFixed(0)}</span>
                        <button type="button" class="btn btn-sm text-danger p-0 border-0" onclick="deleteToppingOrRice('.topping-qty', ${index})">❌</button>
                    </div>
                </li>`;
        }
    });

    // 3. Calculate Set (Multi-select)
    document.querySelectorAll("#set-chashudon, #set-gyoza, #set-hancha").forEach((el) => {
        let qty = parseInt(el.value) || 0;
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>${name} x${qty}</div>
                    <div>
                        <span class="me-3">¥ ${(price * qty).toFixed(0)}</span>
                        <button type="button" class="btn btn-sm text-danger p-0 border-0" onclick="deleteSingleItem('${el.id}')">❌</button>
                    </div>
                </li>`;
        }
    });

    // 4. Calculate Rice (Multi-select)
    document.querySelectorAll(".rice-qty").forEach((el, index) => {
        let qty = parseInt(el.value) || 0;
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>${name} x${qty}</div>
                    <div>
                        <span class="me-3">¥ ${(price * qty).toFixed(0)}</span>
                        <button type="button" class="btn btn-sm text-danger p-0 border-0" onclick="deleteToppingOrRice('.rice-qty', ${index})">❌</button>
                    </div>
                </li>`;
        }
    });

    // 5. Calculate Drinks (お飲み物)
    document.querySelectorAll(".drink-qty").forEach((el, index) => {
        let qty = parseInt(el.value) || 0;
        if (qty > 0) {
            let price = parseFloat(el.getAttribute("data-price"));
            let name = el.getAttribute("data-name");
            total += price * qty;
            summaryHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>${name} x${qty}</div>
                    <div>
                        <span class="me-3">¥ ${(price * qty).toFixed(0)}</span>
                        <button type="button" class="btn btn-sm text-danger p-0 border-0" onclick="deleteToppingOrRice('.drink-qty', ${index})">❌</button>
                    </div>
                </li>`;
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

// 💡 အော်ဒါတစ်ခုချင်းစီကို ဖျက်ပေးမယ့် Function အသစ်များ (New Functions)
function deleteSingleItem(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.value = 0;       // တန်ဖိုးကို ၀ ပြန်လုပ်သည်
        calculateTotal();   // စာရင်းပြန်တွက်ပြီး Summary ကို Update လုပ်သည်
    }
}

function deleteToppingOrRice(className, index) {
    const elements = document.querySelectorAll(className);
    if (elements[index]) {
        elements[index].value = 0; // ရွေးချယ်လိုက်သော Topping/Rice/Drink ကို ၀ ပြန်လုပ်သည်
        calculateTotal();
    }
}

function submitOrder() {
    const name = document.getElementById("custName").value;
    const table = document.getElementById("tableNum").value;

    if (!name || !table) {
        alert("名前とテーブル番号を入力してください。");
        return;
    }

    let orderItems = [];

    // Gather items (Ramen Base)
    document.querySelectorAll(".item-qty").forEach((el) => {
        if (parseInt(el.value) > 0) {
            orderItems.push(`${el.getAttribute("data-name")} (x${el.value})`);
        }
    });

    // Gather Toppings
    document.querySelectorAll(".topping-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            orderItems.push(`Topping: ${el.getAttribute("name") || el.getAttribute("data-name")} (x${qty})`);
        }
    });

    // Gather Multi-select Sets
    document.querySelectorAll("#set-chashudon, #set-gyoza, #set-hancha").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            orderItems.push(`${el.getAttribute("data-name")} (x${qty})`);
        }
    });

    // Gather Rice
    document.querySelectorAll(".rice-qty").forEach((el) => {
        let qty = parseInt(el.value);
        if (qty > 0) {
            orderItems.push(`${el.getAttribute("data-name")} (x${qty})`);
        }
    });

    // Gather Drinks
    document.querySelectorAll(".drink-qty").forEach((el) => {
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
}