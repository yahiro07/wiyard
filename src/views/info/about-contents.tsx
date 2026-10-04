export const AboutContents = () => {
  return (
    <div className="flex-v gap-1 bg-white p-2">
      <h2 className="font-500">Wiyard</h2>
      <div className="text-sm flex-v gap-3 ">
        <p>
          Wiyard is a WebAudio-based audio host application. It's based on the
          Wafer plugin protocol and supports many units, including synthesizers,
          drum machines, and effects.
        </p>
        <p>
          The protocol is designed to be compatible with existing WebAudio apps.
          Under this protocol, several open-source WebAudio apps have been
          ported and included in this app.
        </p>
        <p>
          The graph-editing interface follows the style of Patcher (in FL
          Studio). Since this app is intended for creating multi-part phrases as
          a standalone application, the inputs are extended to multiple ports,
          and it includes a built-in piano roll editor to feed the notes to
          them.
        </p>
        <p>
          An desktop-like, scalable window system is used to make the workflow
          more efficient. You can place many windows in a large desk space, and
          zoom or pan the desk surface.
        </p>
        <p>
          The source code is available on GitHub. For detailed usage, please
          refer to the documentation in the repository.
        </p>
      </div>
    </div>
  );
};
