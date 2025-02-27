const CURRENT_HOST = window.location.host;
const DB_NAME = `sqliteDB@${CURRENT_HOST}`;  // IndexedDB에 저장할 데이터베이스 이름
const OBJECT_KEY = 'sqliteDump'

// 0) IndexedDB 와 ObjectStore 생성
function createNewDatabaseAndObjectStore() {
    return new Promise((resolve, reject) => {
        // IndexedDB 지원 여부 확인
        if (!window.indexedDB) {
            console.error("IndexedDB를 지원하지 않는 환경입니다.");
            reject("IndexedDB를 지원하지 않는 환경입니다.");
            return;
        }

        // 데이터베이스 오픈 (최초 생성 시 onupgradeneeded 호출됨)
        const request = indexedDB.open(DB_NAME, 1);
        console.log(request)

        // onupgradeneeded: DB가 최초 생성되거나 버전 업그레이드 시 호출됨
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 지정된 오브젝트 스토어가 없으면 생성
            if (!db.objectStoreNames.contains(OBJECT_KEY)) {
                db.createObjectStore(OBJECT_KEY);
                console.log(`Object Store '${OBJECT_KEY}'가 생성되었습니다.`);
            }
        };

        // DB 오픈 성공 시
        request.onsuccess = (event) => {
            console.log("새로운 데이터베이스와 오브젝트 스토어가 생성되었습니다.");
            event.target.result.close();
            resolve();
        };

        // DB 오픈 실패 시
        request.onerror = (event) => {
            console.error("데이터베이스 생성에 실패했습니다.", event);
            reject("데이터베이스 생성에 실패했습니다.");
        };
    });
}


// 1) SAVE IndexedDB (CREATE, UPDATE)
export async function saveDBToIndexedDB() {
    const dbData = getCurrentDB().export();
    const buffer = dbData.buffer; // ArrayBuffer 추출
    await deleteDatabase();  // 현재 DB에 유효한 ObjStore 가 없는 경우 삭제
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event) => {
        const db = event.target.result;
        // 오브젝트 스토어 존재 여부 확인
        if (!db.objectStoreNames.contains(OBJECT_KEY)) {
            console.log(`❌ '${OBJECT_KEY}' 오브젝트 스토어가 생성되지 않아 종료합니다.`);
        }
        const transaction = db.transaction(OBJECT_KEY, "readwrite");
        const store = transaction.objectStore(OBJECT_KEY);
        const putRequest = store.put(buffer, "db");
        putRequest.onsuccess = () => {
            console.log("💾 데이터베이스가 IndexedDB에 안전하게 저장되었습니다.");
        };
        putRequest.onerror = (err) => {
            console.error("❌ IndexedDB 저장 실패:", err);
        };
        // 트랜잭션 완료 시점까지 기다리기
        transaction.oncomplete = () => {
            console.log("✅ (DB 저장) IndexedDB 트랜잭션 완료");
        }
    };
    request.onerror = (err) => {
        console.error("❌ IndexedDB 열기 실패:", err);
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(OBJECT_KEY);
    };
}
const $idxDBSaveBtn = document.getElementById('saveDB_browser');
$idxDBSaveBtn.addEventListener('click', saveDBToIndexedDB);



// 2) LOAD IndexedDB (READ)
export async function loadDatabaseFromIndexedDB(version = 1) {
    return new Promise(async (resolve, reject) => {
        // IndexedDB 지원 여부 확인 (1-2)
        if (!window.indexedDB) {
            console.warn("IndexedDB가 지원되지 않습니다. 신규 생성합니다.");
            // 신규 DB 및 오브젝트 스토어 생성 로직 (별도 함수로 구현하거나 여기서 처리)
            await createNewDatabaseAndObjectStore(); // 사용자의 신규 생성 함수 (구현 필요)
            resolve(null);
            return;
        }

        // 기존 DB 열기
        const request = indexedDB.open(DB_NAME, version);
        // 신규 DB 이거나 버전 업그레이드가 필요한 경우
        request.onupgradeneeded = (event) => {
            console.log('신규 IndexedDB 생성')
            const db = event.target.result;
            if (!db.objectStoreNames.contains(OBJECT_KEY)) {
                console.log(`'${OBJECT_KEY}' 오브젝트 스토어 생성 중...`);
                db.createObjectStore(OBJECT_KEY);
            }
        };

        request.onsuccess = async (event) => {
            const db = event.target.result;
            // 1-1) IndexedDB가 존재하는 경우
            // 1-1-2) 오브젝트 스토어가 없는 경우: 버전 증가시켜 생성 후 resolve(null)
            if (!db.objectStoreNames.contains(OBJECT_KEY)) {
                console.warn(`⚠️ '${OBJECT_KEY}' 오브젝트 스토어가 존재하지 않습니다. 버전을 증가시켜 추가합니다.`);
                db.close();
                const newVersion = db.version + 1;
                const upgradeRequest = indexedDB.open(DB_NAME, newVersion);
                upgradeRequest.onupgradeneeded = (event) => {
                    const upgradedDB = event.target.result;
                    if (!upgradedDB.objectStoreNames.contains(OBJECT_KEY)) {
                        upgradedDB.createObjectStore(OBJECT_KEY);
                    }
                };
                upgradeRequest.onsuccess = (event) => {
                    event.target.result.close();
                    resolve(null);
                };
                upgradeRequest.onerror = () => {
                    reject("❌ IndexedDB 오브젝트 스토어 추가 실패");
                };
            } else {
                // 1-1-1) 오브젝트 스토어가 존재하는 경우: 데이터 로드 후 resolve(getRequest.result || null)
                console.log('기존 IndexedDB가 존재합니다. 로드를 시작합니다.')
                const transaction = db.transaction(OBJECT_KEY, "readonly");
                const store = transaction.objectStore(OBJECT_KEY);
                const getRequest = await store.get("db");

                getRequest.onsuccess = () => {
                    if (!getRequest.result) {
                        resolve(null)
                        console.log('IndexDB 의 Obj Store 에 저장된 sqlite 데이터가 없습니다')
                        return;
                    }
                    console.log('indexDB-ObjStore-sqliteDB 를 로딩합니다.')
                    resolve(getRequest.result);
                };

                getRequest.onerror = () => {
                    reject("❌ 데이터베이스 로딩 실패");
                };

                transaction.oncomplete = () => {
                    console.log("(DB 로드) IndexedDB 트랜잭션 종료");
                    db.close();
                };
            }
        };
        request.onerror = (e) => {
            if(e.target.error.name === 'VersionError') {
                const availableVersion = e.target.error.message.split('(')[2][0];
                console.log(`최신버전 로드 : ${availableVersion}`)
                // 아래에서 재귀 호출 수행
                loadDatabaseFromIndexedDB(e.target.error.message.split('(')[2][0])
            } else {
                reject(`❌ IndexedDB 열기 실패 (${e.target.error.name})`);
            }
        };
    });
}
const $idxDBLoadBtn = document.getElementById('loadDB_browser')
$idxDBLoadBtn.addEventListener('click', async () => {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });
    const savedDb = await loadDatabaseFromIndexedDB();
    if (savedDb) {
        const db = new SQL.Database(new Uint8Array(savedDb));
        setCurrentDB(db);
        console.log("✅ 브라우저 IndexedDB 에서 데이터 초기화 완료!");
        await displayUsers();
    }
})

// 3) CLEAR IndexedDB (DELETE)
export async function clearIdxDB() {
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
    request.onsuccess = async (event) => {
        const db = event.target.result;
        db.close();  // DB 닫기
        console.log("✅ IndexedDB 연결 닫음. 삭제 시작...");
        await deleteDatabase(true);
    };
    request.onerror = (err) => {
        console.error("❌ DB 열기 실패:", err);
    };
}
export async function deleteDatabase(force_delete = false) {
    let deleteNeeded = force_delete;
    if (!force_delete) {
        const request = indexedDB.open(DB_NAME);
        request.onsuccess = (event) => {
            const db = event.target.result;
            // 오브젝트 스토어 존재 여부 확인 및 삭제
            if (!db.objectStoreNames.contains(OBJECT_KEY)) {
                console.log(`❌ ${OBJECT_KEY} 오브젝트 스토어가 없는 DB는 사용할 수 없습니다.`);
                deleteNeeded = true;
            }
        }
    }
    if (deleteNeeded) {
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        deleteRequest.onsuccess = async () => {
            console.log("✅ IndexedDB 삭제 완료");
            alert("DB가 초기화되었습니다. 페이지를 새로고침 합니다.");
            await initDatabase();
        };
        deleteRequest.onblocked = () => {
            console.warn("⚠️ 삭제가 차단되었습니다. 열린 DB 연결을 모두 닫아주세요.");
        };
        deleteRequest.onerror = (err) => {
            console.error("❌ IndexedDB 삭제 실패:", err);
        };
    }
}
const $idxDBClearBtn = document.getElementById('clearDB_browser')
$idxDBClearBtn.addEventListener('click', clearIdxDB)
// =====================================================
