let db;  // 데이터베이스 객체
const DB_FILE_URL = "sample-db.sqlite";  // 초기화할 DB 파일 경로
const DB_NAME = "sqliteDB";  // IndexedDB에 저장할 데이터베이스 이름

// SQLite 환경 초기화
async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    // 1) 브라우저 IndexedDB 를 통한 초기화
    const savedDb = await loadDatabaseFromIndexedDB();
    if (savedDb) {
        db = new SQL.Database(new Uint8Array(savedDb));
        console.log("✅ 브라우저 IndexedDB 에서 데이터 초기화 완료!");
        displayUsers();
        return;
    }
    // 2) 로컬 파일 DB 를 통한 초기화
    const response = await fetch(DB_FILE_URL);
    if (response.ok) {
        const data = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(data));
        console.log("✅ 로컬 DB 파일에서 초기화 완료!");
        displayUsers();
        return;
    }
    // 3) 새로 데이터베이스 생성
    db = new SQL.Database();
    // 3-1) 테이블 초기화
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        );
    `);
    console.warn("⚠️ 새로 브라우저 DB 생성 (빈 스키마 초기화)");
    displayUsers();
}

// 회원 추가
document.getElementById("userForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    displayUsers();
    document.getElementById("userForm").reset();
});

// 회원 목록 표시
function displayUsers() {
    const result = db.exec("SELECT * FROM users");
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = "";

    if (result.length > 0) {
        const rows = result[0].values;
        rows.forEach(row => {
            const [id, name, email] = row;
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${id}</td>
                <td><input type="text" value="${name}" id="name-${id}"></td>
                <td><input type="email" value="${email}" id="email-${id}"></td>
                <td><button onclick="updateUser(${id})">수정</button></td>
                <td><button onclick="deleteUser(${id})">삭제</button></td>
            `;

            tableBody.appendChild(tr);
        });
    }
}

// 회원 정보 수정
function updateUser(id) {
    const newName = document.getElementById(`name-${id}`).value;
    const newEmail = document.getElementById(`email-${id}`).value;

    db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [newName, newEmail, id]);
    displayUsers();
}

// 회원 삭제
function deleteUser(id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        db.run("DELETE FROM users WHERE id = ?", [id]);
        displayUsers();
    }
}

// 데이터베이스 파일 저장
function saveDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: "application/octet-stream" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "database.sqlite";
    link.click();
    alert("데이터베이스가 저장되었습니다.");
}
const $dbSaveBtn = document.getElementById('saveDB')
$dbSaveBtn.addEventListener('click', saveDatabase)

// 데이터베이스 파일 불러오기
async function loadDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = "";
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
        db = new SQL.Database(data);
        console.log("📂 파일로부터 데이터베이스 로드 완료.");
        displayUsers();
    };
    reader.readAsArrayBuffer(file);
}
const $dbLoadBtn = document.getElementById('loadDB')
$dbLoadBtn.addEventListener('change', loadDatabase)

// =====================================================
// 데이터베이스 IndexedDB에 저장
function saveDBToIndexedDB() {
    const dbData = db.export();
    const blob = new Blob([dbData], { type: "application/octet-stream" });
    indexedDB.deleteDatabase(DB_NAME);
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        // 오브젝트 스토어 존재 여부 확인
        if (!db.objectStoreNames.contains("sqliteDB")) {
            console.log("❌ 'sqliteDB' 오브젝트 스토어가 생성되지 않아 종료합니다.");
        }
        const transaction = db.transaction("sqliteDB", "readwrite");
        const store = transaction.objectStore("sqliteDB");
        const putRequest = store.put(blob, "db");
        putRequest.onsuccess = () => {
            console.log("💾 데이터베이스가 IndexedDB에 안전하게 저장되었습니다.");
        };
        putRequest.onerror = (err) => {
            console.error("❌ IndexedDB 저장 실패:", err);
        };
        // 트랜잭션 완료 시점까지 기다리기
        transaction.oncomplete = () => {
            console.log("✅ IndexedDB 트랜잭션 완료");
        }
    };
    request.onerror = (err) => {
        console.error("❌ IndexedDB 열기 실패:", err);
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("sqliteDB");
    };
}
const $idxDBSaveBtn = document.getElementById('saveDB_browser');
$idxDBSaveBtn.addEventListener('click', saveDBToIndexedDB);

// IndexedDB 에서 데이터베이스 불러오기
async function loadDatabaseFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            // 오브젝트 스토어 존재 여부 확인
            if (!db.objectStoreNames.contains("sqliteDB")) {
                console.warn("⚠️ 'sqliteDB' 오브젝트 스토어가 존재하지 않습니다.");
                resolve(null);
                return;
            }
            const transaction = db.transaction("sqliteDB", "readonly");
            const store = transaction.objectStore("sqliteDB");
            const getRequest = store.get("db");
            getRequest.onsuccess = () => {
                resolve(getRequest.result ? getRequest.result.arrayBuffer() : null);
            };
            getRequest.onerror = () => reject("❌ 데이터베이스 로딩 실패");
            // 트랜잭션 완료 시점 명확히 처리
            transaction.oncomplete = () => {
                console.log("✅ IndexedDB 트랜잭션 완료");
            };
        };
        request.onerror = () => reject("❌ IndexedDB 열기 실패");
    });
}
const $idxDBLoadBtn = document.getElementById('loadDB_browser')
$idxDBLoadBtn.addEventListener('click', async () => {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });
    const savedDb = await loadDatabaseFromIndexedDB();
    if (savedDb) {
        db = new SQL.Database(new Uint8Array(savedDb));
        console.log("✅ 브라우저 IndexedDB 에서 데이터 초기화 완료!");
        displayUsers();
    }
})

// IndexedDB의 DB 삭제 (초기화)
async function clearIdxDB() {
    console.log("🗑 IndexedDB 삭제 시작...");
    // 현재 IndexedDB 목록 가져오기
    const databases = await indexedDB.databases();
    const dbExists = databases.some(db => db.name === DB_NAME);
    if (!dbExists) {
        console.log("📂 IndexedDB가 존재하지 않음. 삭제 작업을 중단합니다.");
        return;  // ❌ DB가 없으면 함수 종료
    }

    console.log("🔒 열린 IndexedDB 닫기...");
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = (event) => {
        const db = event.target.result;
        db.close();  // DB 닫기
        console.log("✅ IndexedDB 연결 닫음. 삭제 시작...");
        deleteDatabase();
    };
    request.onerror = (err) => {
        console.error("❌ DB 열기 실패:", err);
    };
}

function deleteDatabase() {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    deleteRequest.onsuccess = () => {
        console.log("✅ IndexedDB 삭제 완료");
        alert("DB가 초기화되었습니다. 페이지를 새로고침 합니다.");
        initDatabase();
    };
    deleteRequest.onblocked = () => {
        console.warn("⚠️ 삭제가 차단되었습니다. 열린 DB 연결을 모두 닫아주세요.");
    };
    deleteRequest.onerror = (err) => {
        console.error("❌ IndexedDB 삭제 실패:", err);
    };
}

const $idxDBClearBtn = document.getElementById('clearDB_browser')
$idxDBClearBtn.addEventListener('click', clearIdxDB)
// =====================================================

// 페이지 로딩 시 DB 초기화
window.onload = initDatabase;