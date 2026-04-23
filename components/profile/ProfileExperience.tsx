type Experience = {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
};

const mockExperiences: Experience[] = [
  // {
  //   id: 1,
  //   role: "Full Stack Developer",
  //   company: "CodeCrafters LLC",
  //   duration: "Jun 2018 - Aug 2021",
  //   description: "Developed scalable web applications using LAMP stack.",
  // },
];

export default function ProfileExperience() {
  return (
    <div className="card bg-base-100 shadow p-5 space-y-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Work Experience</h2>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </div>

      {mockExperiences.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed rounded-lg">
          <p className="text-sm opacity-70 mb-3">
            No work experience added yet.
          </p>
          <button className="btn btn-sm btn-primary">
            Add Experience
          </button>
        </div>
      ) : (
        mockExperiences.map((exp) => (
          <div key={exp.id} className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-semibold">{exp.role}</h3>
            <p className="text-sm text-base-content/70">
              {exp.company} • {exp.duration}
            </p>
            <p className="text-sm mt-2 text-base-content/70">
              {exp.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}