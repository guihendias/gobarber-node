import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IFindAllProvidersDRO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDRO): Promise<User[]> {
        let users = this.users;

        if (except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id);
        }

        return users;
    }

    async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }
    async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);
        return findUser;
    }
    async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id
        );

        this.users[findIndex] = user;

        return user;
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid(), ...data });

        this.users.push(user);

        return user;
    }
}

export default FakeUsersRepository;
