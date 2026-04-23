type Education = {
  id: number;
  degree: string;
  school: string;
  duration: string;
};

const mockEducation: Education[] = [
  // {
  //   id: 1,
  //   degree: "Bachelor of Science in Computer Science",
  //   school: "Your University",
  //   duration: "2015 - 2019",
  // },
];

export default function ProfileEducation() {
  return (
    <div className="card bg-base-100 shadow p-5 space-y-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Education</h2>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </div>

      {mockEducation.length === 0 ? (
        <div className="text-center py-6 px-4 border border-dashed rounded-lg">
          <p className="text-sm opacity-70 mb-3">
            No education details added yet.
          </p>
          <button className="btn btn-sm btn-primary">
            Add Education
          </button>
        </div>
      ) : (
        mockEducation.map((edu) => (
          <div key={edu.id} className="p-4 border border-base-300 rounded-lg">
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-sm text-base-content/70">
              {edu.school} • {edu.duration}
            </p>
          </div>
        ))
      )}
    </div>
  );
}