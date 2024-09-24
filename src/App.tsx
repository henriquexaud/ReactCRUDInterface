import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nome: '', email: '', senha: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3333/usuarios');
      setUsers(response.data);
    } catch (error) {
      window.alert(`Erro ao buscar os usuários: ${error}`);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3333/usuarios/${id}`);
      setUsers(users.filter(user => user.id !== id));
      window.alert(`Usuário com id ${id} deletado com sucesso.`);
    } catch (error) {
      window.alert(`Erro ao deletar o usuário: ${error}`);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3333/usuarios', newUser, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUsers([...users, response.data]);
      setIsModalOpen(false);
      setNewUser({ nome: '', email: '', senha: '' });
      window.alert(`Usuário ${newUser.nome} criado com sucesso!`);
      window.location.reload();
    } catch (error) {
      window.alert(`Erro ao criar o usuário: ${error}`);
    }
  };

  const updateUser = async () => {
    if (editingUser) {
      try {
        const response = await axios.put(`http://localhost:3333/usuarios/${editingUser.id}`, editingUser, {
          headers: { 'Content-Type': 'application/json' }
        });
        setUsers(users.map(user => (user.id === editingUser.id ? response.data : user)));
        setIsModalOpen(false);
        setEditingUser(null);
        window.alert(`Usuário ${editingUser.nome} atualizado com sucesso!`);
        window.location.reload();
      } catch (error) {
        window.alert(`Erro ao atualizar o usuário: ${error}`);
      }
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Lista de Usuários</h1>
      <div className="card-container">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="card">
              <h2>{user.nome}</h2>
              <p>Email: {user.email}</p>
              <p>Senha: {user.senha}</p>
              <button className="delete-button" onClick={() => deleteUser(user.id)}>Deletar</button>
              <button className="edit-button" onClick={() => openEditModal(user)}>Editar</button>
            </div>
          ))
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <input
              type="text"
              placeholder="Nome"
              value={editingUser ? editingUser.nome : newUser.nome}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, nome: e.target.value })
                  : setNewUser({ ...newUser, nome: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Senha"
              value={editingUser ? editingUser.senha : newUser.senha}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, senha: e.target.value })
                  : setNewUser({ ...newUser, senha: e.target.value })
              }
            />
            <button onClick={() => setIsModalOpen(false)} className="close-button">Fechar</button>
            <button
              onClick={editingUser ? updateUser : createUser}
              className="create-button"
            >
              {editingUser ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setIsModalOpen(true)} className="add-button">Adicionar Usuário</button>
    </div>
  );
}

export default App;
