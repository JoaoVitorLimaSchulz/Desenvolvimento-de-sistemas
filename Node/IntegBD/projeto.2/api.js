const API = "http://localhost:3000";


async function safeJson(res) {
    let data = null;
    try {
        data = await res.json();
    } catch {
       
    }

    return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        data
    };
}

// GET
async function apiGet(endpoint) {
    try {
        const res = await fetch(API + endpoint);
        return await safeJson(res);
    } catch (error) {
        return { ok: false, message: error.message };
    }
}

async function apiPost(endpoint, data) {
    try {
        const res = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await safeJson(res);
    } catch (error) {
        return { ok: false, message: error.message };
    }
}


async function apiPut(endpoint, data) {
    try {
        const res = await fetch(API + endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await safeJson(res);
    } catch (error) {
        return { ok: false, message: error.message };
    }
}

async function apiDelete(endpoint) {
    try {
        const res = await fetch(API + endpoint, {
            method: "DELETE"
        });
        return await safeJson(res);
    } catch (error) {
        return { ok: false, message: error.message };
    }
}
