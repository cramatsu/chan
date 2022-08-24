import type {
  Activity,
  ClientPresenceStatusData,
  PresenceStatus,
} from 'discord.js';

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  discrim: number;
  activity: ModifiedActivity;
  status: PresenceStatus;
  bio: string | null;
  spotify: Spotify | null;
  web: boolean;
  mobile: boolean;
  desktop: boolean;
}
export interface Assets {
  largeText: string;
  smallText: string;
  largeImage: string;
  smallImage: string;
}

// Coming future!
type PartialNull<T> = {
  [P in keyof T]: T[P] | null;
};

export interface Spotify {
  albumName: string;
  timestamps: Activity['timestamps'];
  songName: string;
  cover: string;
  artist: string;
  type: ActivityTypeToNumber;
}
export class UserBuilder {
  private _user: UserData;

  public constructor() {
    this._user = {
      avatar: '',
      bio: null,
      status: null,
      username: '',
      discrim: null,
      id: '',
      spotify: null,
      desktop: false,
      mobile: false,
      web: false,
      activity: null,
    };
  }

  public setAvatarUrl(url: string): this {
    this._user.avatar = url;
    return this;
  }
  public setStatus(status: PresenceStatus): this {
    this._user.status = status;
    return this;
  }

  public setDesktopPlatform(isDesktop: boolean): this {
    this._user.desktop = isDesktop;
    return this;
  }
  public setWebPlatform(isWeb: boolean): this {
    this._user.web = isWeb;
    return this;
  }
  public setMobilePlatform(isMobile: boolean): this {
    this._user.mobile = isMobile;
    return this;
  }
  public setUsername(username: string) {
    this._user.username = username;
    return this;
  }

  public setId(id: string): this {
    this._user.id = id;
    return this;
  }
  public setDiscrim(discrim: number): this {
    this._user.discrim = discrim;
    return this;
  }

  /**
   * @expretimental
   */
  public setBio(bio: string): this {
    this._user.bio = bio;
    return this;
  }

  public setActivity(activity: ModifiedActivity): this {
    this._user.activity = activity;
    return this;
  }

  public setSpotify(spotify: Spotify): Omit<this, 'setSpotify'> {
    this._user.spotify = spotify;
    return this;
  }
  public build(): UserData {
    return this._user;
  }
}

type ActivityTypeToNumber =
  `${Activity['type']}` extends `${infer U extends number}` ? U : never;

type UserPlatform<T = Required<ClientPresenceStatusData>> = {
  [K in keyof T]: boolean;
};

type ModifiedActivity = Omit<
  Activity,
  'flags' | 'party' | 'toString' | 'equals' | 'createdAt'
>;
