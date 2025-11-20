import { Channel, ChannelModel } from 'amqplib';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
}

export interface Session {
  userId: string;
};

export interface EmailData {
  destinyEmail: string;
  title: string;
  text: string;
}

export interface QueueConnectReturn {
  channel: Channel;
  connection: ChannelModel;
}
