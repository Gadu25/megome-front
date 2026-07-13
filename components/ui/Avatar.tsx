import { Profile } from "@/types/domain";

type Props = {
  profile: Profile;
  size?: string;
  fontSize?: string;
}

export default function Avatar({ profile, size = "w-8", fontSize = "text-xs" }: Props) {
  const image = profile.profileImage;
  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="avatar cursor-pointer">
      <div className={`rounded-full overflow-hidden flex items-center justify-center ${!image ? "bg-accent" : ""} ${size}`}>
        {image ? (
          <img src={image} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className={`${fontSize} text-accent-content font-semibold`}>
            {initials || "?"}
          </span>
        )}
      </div>
    </div>
  )
}
