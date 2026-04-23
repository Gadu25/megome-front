"use client";

import { profileApi } from "@/lib/api/profileApi";
import { Profile } from "@/types/types";
import { calculateAge } from "@/functions/calculateAge";
import { MapPinIcon, PhoneIcon, GlobeAltIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import RightModal from "../modal/RightModal";
import ProfileForm from "../form/Profile";

export default function TopProfile() {
  const { getProfile } = profileApi();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Avatar profile={profile} size="w-30" />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}, { calculateAge(profile.birthday) }
            </h1>
            <p className="text-base-content/70"> {profile.title} • {profile.location} </p>
          </div>
          <button className="btn btn-xs" onClick={() => setIsEditOpen(true)}>
            <PencilSquareIcon className="size-5"/>
          </button>
        </div>
      
        <div className="flex flex-col text-sm gap-1 text-base-content/70">
          <p>{profile.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mt-2">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" /> {profile.location}
            </div>
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-4 h-4" /> {profile.phone}
            </div>
            <div className="flex items-center gap-1">
              <GlobeAltIcon className="w-4 h-4" /> {profile.website}
            </div>
          </div>
        </div>
      </div>
      <RightModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileForm profile={profile} setProfile={setProfile}/>
      </RightModal>
    </>
  );
}