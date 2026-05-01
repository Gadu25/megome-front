export default function StepConfirm({ form, tech }: any) {
  return (
    <div className="space-y-2">

      <p><b>Title:</b> {form.title}</p>
      <p><b>Description:</b> {form.description}</p>

      <div>
        <b>Tech:</b>
        <div className="flex gap-2">
          {tech.map((t: string) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      </div>

    </div>
  )
}