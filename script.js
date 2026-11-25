// LocalStorage를 활용한 데이터 유지
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionForm = document.getElementById("transactionForm");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalBalance = document.getElementById("totalBalance");
const balanceWarning = document.getElementById("balanceWarning");
const balanceCard = document.getElementById("balanceCard");
const transactionList = document.getElementById("transactionList");

// 추가된 DOM 요소
const myTotalExpense = document.getElementById("myTotalExpense");
const comparisonResult = document.getElementById("comparisonResult");

// 페이지 로드 시 초기 렌더링
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});

// 내역 추가 이벤트
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);
  const memo = document.getElementById("memo").value;

  if (!date || !amount) {
    alert("날짜와 금액을 모두 입력해주세요.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    type,
    date,
    category,
    amount,
    memo,
  };

  transactions.push(newTransaction);
  saveAndRender();
  transactionForm.reset();
});

// 삭제 함수
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderApp();
}

function renderApp() {
  renderList();
  updateCalculations();
}

// 리스트 렌더링
function renderList() {
  transactionList.innerHTML = "";
  transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `
            <div class="item-info">
                <span>[${t.date}]</span>
                <span><strong>[${t.category}]</strong></span>
                <span>${t.memo ? t.memo : ""}</span>
            </div>
            <div>
                <span style="color: ${t.type === "income" ? "#27ae60" : "#c0392b"}; font-weight: bold; margin-right: 15px;">
                    ${t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}원
                </span>
                <button class="delete-btn" onclick="deleteTransaction(${t.id})">삭제</button>
            </div>
        `;
      transactionList.appendChild(li);
    });
}

// 계산 및 조건문 처리 (잔액 상태 & 평균 지출 비교)
function updateCalculations() {
  let incomeSum = 0;
  let expenseSum = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      incomeSum += t.amount;
    } else {
      expenseSum += t.amount;
    }
  });

  const balance = incomeSum - expenseSum;

  totalIncome.textContent = incomeSum.toLocaleString() + "원";
  totalExpense.textContent = expenseSum.toLocaleString() + "원";
  totalBalance.textContent = balance.toLocaleString() + "원";

  // 1. 잔액별 상태 변화 조건문 (수업 내용 적용)
  if (balance < 0) {
    balanceWarning.textContent = "⚠️ 경고: 잔액이 마이너스입니다!";
    balanceWarning.className = "warning-text alert-red";
    balanceCard.style.border = "2px solid #c0392b";
  } else if (balance < 50000) {
    balanceWarning.textContent = "⚠️ 주의: 잔액이 5만 원 미만입니다.";
    balanceWarning.className = "warning-text alert-red";
    balanceCard.style.border = "2px solid #e67e22";
  } else {
    balanceWarning.textContent = "✅ 안전: 자산 상태가 양호합니다.";
    balanceWarning.className = "warning-text alert-green";
    balanceCard.style.border = "none";
  }

  // 2. 대학생 평균 소비 금액 비교 조건문 (추가됨)
  const avgExpense = 681000; // 68만 1천 원
  myTotalExpense.textContent = expenseSum.toLocaleString() + "원";

  if (expenseSum === 0) {
    comparisonResult.textContent =
      "💡 지출 내역을 입력하시면 또래 월평균 소비와 비교해 드립니다.";
    comparisonResult.style.color = "#7f8c8d";
  } else {
    const diff = expenseSum - avgExpense;
    if (expenseSum > avgExpense) {
      comparisonResult.innerHTML = `⚠️ 또래 월평균 소비보다 <span class="alert-red">${diff.toLocaleString()}원 더 많이</span> 지출하고 있습니다. 절약이 필요합니다!`;
    } else {
      comparisonResult.innerHTML = `👏 또래 월평균 소비보다 <span class="alert-green">${Math.abs(diff).toLocaleString()}원 절약</span>하고 있습니다. 훌륭한 소비 습관입니다!`;
    }
  }
}

// 메인 페이지(index.html)로 돌아가기
function goToMain() {
  window.location.href = "index.html";
}
