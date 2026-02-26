export const AmbientBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
    <div className="absolute inset-0 bg-gradient-to-br from-electricBlue/5 via-hotMagenta/5 to-sunsetOrange/5" />
    <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-electricBlue/20 blur-[120px]" />
    <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-hotMagenta/15 blur-[130px]" />
  </div>
)
