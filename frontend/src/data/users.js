export const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        firstName: 'Ahmed',
        lastName: 'Mohamed',
        birthDate: '1985-05-15',
        gender: 'male',
        city: 'Cairo',
        address: '123 Tahrir Square',
        email: 'admin@tazkarti.com',
        role: 'admin',
        approved: true
    },
    {
        id: 2,
        username: 'manager1',
        password: 'manager123',
        firstName: 'Hassan',
        lastName: 'Ali',
        birthDate: '1980-03-20',
        gender: 'male',
        city: 'Cairo',
        address: '456 Nasr City',
        email: 'hassan@efa.com',
        role: 'manager',
        approved: true
    },
    {
        id: 3,
        username: 'fan1',
        password: 'fan123',
        firstName: 'Fatima',
        lastName: 'Ibrahim',
        birthDate: '1995-08-10',
        gender: 'female',
        city: 'Alexandria',
        address: '789 Corniche Road',
        email: 'fatima@example.com',
        role: 'fan',
        approved: true
    },
    {
        id: 4,
        username: 'fan2',
        password: 'fan456',
        firstName: 'Omar',
        lastName: 'Khaled',
        birthDate: '1998-12-25',
        gender: 'male',
        city: 'Giza',
        address: '',
        email: 'omar@example.com',
        role: 'fan',
        approved: true
    },
    {
        id: 5,
        username: 'pending_manager',
        password: 'pending123',
        firstName: 'Mahmoud',
        lastName: 'Saeed',
        birthDate: '1988-07-18',
        gender: 'male',
        city: 'Cairo',
        address: '321 Heliopolis',
        email: 'mahmoud@example.com',
        role: 'manager',
        approved: false // Waiting for admin approval
    }
];

export const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

export const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

export const validateCredentials = (username, password) => {
    const user = findUserByUsername(username);
    if (!user) return null;
    if (user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const getPendingUsers = () => {
    return users.filter(user => !user.approved);
};
