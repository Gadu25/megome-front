"use client";

import { useEffect, useState } from "react";

import {
  GlobeAltIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import Avatar from "@/components/ui/Avatar";
import RightModal from "@/components/ui/modal/RightModal";
import ProfileForm from "./ProfileForm";

import { calculateAge } from "@/utils/date/calculateAge";
import { getProfileClient } from "@/lib/api/client/profile";

import type { Profile } from "@/types/domain";

interface props {
  isProfileSetup: boolean;
}

export default function TopProfile({ isProfileSetup }: props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileClient();
        setProfile(res.profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    setIsEditOpen(isProfileSetup)
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* Avatar */}
        <div className="flex justify-center lg:justify-start">
          <div className="skeleton h-28 w-28 rounded-full shrink-0"></div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">

          {/* Header */}
          <div
            className="
              flex flex-col gap-4
              sm:flex-row sm:items-start sm:justify-between
            "
          >
            {/* Left */}
            <div className="space-y-3 text-center sm:text-left">

              {/* Name + title */}
              <div className="space-y-2">
                <div className="skeleton h-8 w-64 mx-auto sm:mx-0"></div>
                <div className="skeleton h-4 w-40 mx-auto sm:mx-0"></div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <div className="skeleton h-6 w-24 rounded-full"></div>
                <div className="skeleton h-6 w-32 rounded-full"></div>
              </div>
            </div>

            {/* Edit button */}
            <div className="skeleton h-9 w-32 self-center sm:self-start rounded-lg"></div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-full max-w-3xl"></div>
            <div className="skeleton h-4 w-[95%] max-w-3xl"></div>
            <div className="skeleton h-4 w-[80%] max-w-2xl"></div>
          </div>

          {/* Metadata */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="skeleton h-16 rounded-xl"></div>
            <div className="skeleton h-16 rounded-xl"></div>
            <div className="skeleton h-16 rounded-xl"></div>
          </div>

        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-base-content/60">
        No profile found.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* Avatar */}
        <div className="flex justify-center lg:justify-start">
          <Avatar
            profile={profile}
            size="w-28"
            fontSize="text-3xl"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">

          {/* Header */}
          <div
            className="
              flex flex-col gap-4
              sm:flex-row sm:items-start sm:justify-between
            "
          >
            <div className="space-y-2 text-center sm:text-left">

              <div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                  {profile.firstName} {profile.lastName}
                </h1>

                <p className="mt-1 text-base text-base-content/70">
                  {profile.title}
                </p>

                {profile.tagline && (
                  <p className="mt-2 text-sm font-medium italic text-primary">
                    "{profile.tagline}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.birthday ? (
                  <span className="badge badge-outline">
                    {calculateAge(profile.birthday)} years old
                  </span>
                )
                : null}
              </div>
            </div>

            {/* Edit Button */}
            <button
              className="btn btn-sm gap-2 self-center sm:self-start"
              onClick={() => setIsEditOpen(true)}
            >
              <PencilSquareIcon className="size-4" />
              Edit Profile
            </button>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="max-w-3xl text-sm leading-7 text-base-content/75">
              {profile.bio}
            </p>
          )}

          {/* Metadata */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {profile.location && (
              <ProfileMeta
                icon={<MapPinIcon className="size-4" />}
                label="Location"
                value={profile.location}
              />
            )}

            {profile.phone && (
              <ProfileMeta
                icon={<PhoneIcon className="size-4" />}
                label="Phone"
                value={profile.phone}
              />
            )}

            {profile.website && (
              <ProfileMeta
                icon={<GlobeAltIcon className="size-4" />}
                label="Website"
                value={profile.website}
              />
            )}
          </div>
        </div>
      </div>

      <RightModal
        title="Profile"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
        />
      </RightModal>
    </>
  );
}

type ProfileMetaProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function ProfileMeta({
  icon,
  label,
  value,
}: ProfileMetaProps) {
  return (
    <div
      className="rounded-2xl border border-base-300 bg-base-200/40 p-3"
    >
      <div className="flex items-start gap-3">

        <div className="mt-0.5 text-base-content/50">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-base-content/50">
            {label}
          </p>

          <p className="truncate text-sm">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
