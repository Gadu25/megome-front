export default function ProfileSkill() {
  return (
    <div className="card bg-base-100 shadow p-5">
      <h2 className="font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        <span className="badge badge-outline">JavaScript</span>
        <span className="badge badge-outline">TypeScript</span>
        <span className="badge badge-outline">React</span>
        <span className="badge badge-outline">Go</span>
        <span className="badge badge-outline">PostgreSQL</span>
      </div>
    </div>
  )
}