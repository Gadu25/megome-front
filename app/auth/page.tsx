 import { BoltIcon, ShieldCheckIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'

export default function Auth() {
  return (
    <>
      <div className="flex h-screen w-screen">
        {/* header */}
        <div className="flex-1 flex flex-col justify-between bg-gray-900 p-10">
          <div className="flex items-center">
            <div className="font-bold text-3xl tracking-widest">megome</div>
            <span className="border border-solid border-gray-800 text-xs flex justify-center items-center py-1 px-2 rounded-full ms-4">API-First Portfolio Platform</span>
          </div>

          {/* body */}
          <div className="">
            <h1 className="text-6xl">Your Portfolio.<br/>Powered by <span className="text-teal-400">API_</span></h1>
            <div className="py-4">
              <p className="text-xl">Store, Manage, Expose.</p>
              <p className="text-xl">Your career data, structured and developer ready.</p>
            </div>
            <div className="border border-solid border-gray-800 rounded-xl max-w-lg">
              <div className="flex justify-between p-2 items-center bg-linear-to-r from-gray-800 to-gray-900 rounded-tl-xl rounded-tr-xl">
                <div className="flex gap-4 items-center mx-4"><div className="size-2 rounded-full bg-teal-400"></div>API Response</div>
                <div className="tracking-[4px]">•••</div>
              </div>
              <div className="p-2">
                <pre className="bg-gray-900 text-gray-100 font-mono rounded-lg p-6 text-sm">
                  {"{"}
                    <div className="ms-4 mt-2 mb-2">
                      <span className="text-blue-400">"name"</span>: <span className="text-green-400">"John Doe"</span>,
                      <br />
                      <span className="text-blue-400">"role"</span>: <span className="text-green-400">"Full Stack Engineer"</span>,
                      <br />
                      <span className="text-blue-400">"skills"</span>: [
                        <span className="text-yellow-400">"Go"</span>, <span className="text-yellow-400">"Next.js"</span>, <span className="text-yellow-400">"AWS"</span>
                      ],
                      <br />
                      <span className="text-blue-400">"projects"</span>: <span className="text-purple-400">12</span>
                    </div>
                  {"}"}
                </pre>
              </div>
            </div>
            <div className="flex justify-between max-w-lg mt-8 text-gray-400">
              <div className="p-2 flex gap-2 items-center">
                <BoltIcon className="size-6" />
                <span>Fast</span>
              </div>
              <div className="p-2 flex gap-2 items-center">
                <ShieldCheckIcon className="size-6" />
                <span>Secure</span>
              </div>
              <div className="p-2 flex gap-2 items-center">
                <PuzzlePieceIcon className="size-6" />
                <span>Plug & Play</span>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="text-gray-700">
            <span>© 2026 Megome • Built for developers.</span>
          </div>
        </div>
        <div className="flex-1 bg-linear-to-br from-gray-900 to-slate-950 p-8 flex justify-center items-center">

          <div>World</div>
        </div>
      </div>
    </>
  )
}