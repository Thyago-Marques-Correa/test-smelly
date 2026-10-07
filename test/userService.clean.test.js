const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve atribuir um id ao criar um usuário', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.id).toBeDefined();
  });

  test('deve encontrar o usuário pelo id depois de criado', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe(nome);
  });

  test('deve criar o usuário com status ativo', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.status).toBe('ativo');
  });

  test('deve retornar true ao desativar um usuário comum', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
  });

  test('deve marcar o usuário comum como inativo depois de desativado', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    userService.deactivateUser(usuarioComum.id);

    // Assert
    expect(userService.getUserById(usuarioComum.id).status).toBe('inativo');
  });

  test('deve retornar false ao tentar desativar um administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
  });

  test('deve incluir o nome de cada usuário no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
  });

  test('deve lançar erro ao criar usuário menor de idade', () => {
    // Arrange
    const { nome, email } = dadosUsuarioPadrao;

    // Act
    const criarMenor = () => userService.createUser(nome, email, 17);

    // Assert
    expect(criarMenor).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve informar que não há usuários quando o relatório está vazio', () => {
    // Arrange (nenhum usuário criado)

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado');
  });
});
