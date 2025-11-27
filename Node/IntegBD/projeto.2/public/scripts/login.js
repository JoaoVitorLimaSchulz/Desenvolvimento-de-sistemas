const API = "http://localhost:3000";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();
    const erro = document.getElementById("erro");

    if (!resposta.ok) {
        erro.textContent = resultado.erro || "Credenciais inválidas";
        return;
    }

    erro.textContent = "";

    // Armazena sessão no navegador
    localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
    localStorage.setItem("token", resultado.token);

    // Redireciona para o painel
    window.location.href = "dashboard.html";
});
