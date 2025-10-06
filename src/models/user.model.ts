export type TUserModel = TBaseModel & {
  email: string;
  name: string;
  password: string;
}

export type TUserCreateInput = Required<Pick<TUserModel, 'email' | 'name' | 'password'>>;
export type TUserUpdateInput = Partial<Pick<TUserModel, 'email' | 'name' | 'password'>>;