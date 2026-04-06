export interface LoginUser{
    login: string;
    password: string;
}

export interface RegisterUser{
    username: string;
    password: string;
    email: string;
    name: string;
}

export interface UserInfo{
    id: string;
    username: string;
    email: string;
    name: string;
}

export interface UpdateName{
    name: string;
}

export interface UpdatePassword{
    confirmPassword: string;
    newPassword: string; 
}

export interface UpdateEmail{
    newEmail: string;
}

export interface UpdateUsername{
    newUsername: string;
}