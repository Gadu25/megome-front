import { Profile } from "@/types/types";

type Props = {
  profile: Profile;
  size: string
}

export default function Avatar({ profile, size }: Props) {
  const image = profile.profileImage;
  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="avatar cursor-pointer">
      <div className={`rounded-full overflow-hidden flex items-center justify-center ${!image ? "bg-accent" : ""} size-${size ? size : "8"}`}>
        {image ? (
          <img src={image} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-accent-content font-semibold">
            {initials || "?"}
          </span>
        )}
      </div>
    </div>
  )
}