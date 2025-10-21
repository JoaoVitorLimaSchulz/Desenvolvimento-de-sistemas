const mysql = require('mysql2/promise'); // Importa a versão com promessas

const dbConfig = {
    host: 'localhost', // Endereço do seu MySQL (geralmente 'localhost' para instalação local)
    user: 'root',      // Seu usuário do MySQL (pode ser 'root' ou outro que você configurou)
    password: '', // Sua senha do MySQL (SUBSTITUA PELA SUA SENHA REAL!)
    database: 'usuariosDB', // O nome do banco de dados que criamos
    waitForConnections: true,
    connectionLimit: 10, // Define o número máximo de conexões no pool
    queueLimit: 0
};

// Cria um pool de conexões. É mais eficiente para APIs, pois reutiliza conexões.
const pool = mysql.createPool(dbConfig);

// Testa a conexão ao iniciar o pool
pool.getConnection()
    .then(connection => {
        console.log('Conexão com o MySQL estabelecida com sucesso!');
        connection.release(); // Libera a conexão de volta para o pool
    })
    .catch(err => {
        console.error('Erro ao conectar ao MySQL:', err.message);
        // É crítico que a aplicação não continue se não puder se conectar ao DB
        process.exit(1); // Encerra o processo da aplicação
    });

module.exports = pool; // Exporta o pool para ser usado em outras partes da aplicação
