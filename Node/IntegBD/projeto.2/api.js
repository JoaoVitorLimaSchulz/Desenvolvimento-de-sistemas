const API = "http://localhost:3000"; // ajuste se precisar

async function apiGet(endpoint) {
    const res = await fetch(API + endpoint);
    return res.json();
}

async function apiPost(endpoint, data) {
    const res = await fetch(API + endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json();
}

async function apiPut(endpoint, data) {
    const res = await fetch(API + endpoint, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json();
}

async function apiDelete(endpoint) {
    const res = await fetch(API + endpoint, { method: "DELETE" });
    return res.json();
}
