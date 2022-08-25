import { ActivityType, GuildMember } from 'discord.js';
import { UserBuilder, UserData } from '../dto/user.entity';

export const minimalPresence = (
  member: GuildMember,
): Pick<UserData, 'avatar' | 'discrim' | 'username' | 'status' | 'id'> => {
  return {
    avatar: member.user.avatarURL(),
    id: member.id,
    discrim: +member.user.discriminator,
    status: member.presence.status,
    username: member.user.username,
  };
};
export const prettyPresence = (data: {
  member: GuildMember;
  bio?: string;
}): UserData => {
  const { member, bio } = data;
  const { clientStatus } = member.presence;
  const activities = member.presence.activities;
  const spotify = member.presence.activities.find(
    (it) => it.name === 'Spotify',
  );

  const activity = activities.find((it) => {
    return (
      it.type !== ActivityType.Custom && it.type !== ActivityType.Listening
    );
  });

  return new UserBuilder()
    .setBio(bio)
    .setAvatarUrl(member.user.avatarURL())
    .setDiscrim(+member.user.discriminator)
    .setActivity(
      activity
        ? {
            applicationId: activity.applicationId,
            assets: activity.assets,
            buttons: activity.buttons,
            createdTimestamp: activity.createdTimestamp,
            details: activity.details,
            name: activity.name,
            emoji: activity.emoji,
            state: activity.state,
            timestamps: activity.timestamps,
            type: activity.type,
            url: activity.url,
          }
        : null,
    )
    .setSpotify(
      spotify
        ? {
            cover: spotify.assets.largeImage
              ? `https://i.scdn.co/image/${
                  spotify.assets.largeImage.split(':')[1]
                }`
              : null,
            artist: spotify.state.replace(';', ','),
            songName: spotify.details,
            timestamps: spotify.timestamps,
            albumName: spotify.assets.largeText,
            type: spotify.type,
          }
        : null,
    )
    .setStatus(member.presence.status)
    .setDesktopPlatform(!!clientStatus.desktop)
    .setWebPlatform(!!clientStatus.web)
    .setMobilePlatform(!!clientStatus.mobile)
    .setUsername(member.user.username)
    .setId(member.id)
    .build();
};
