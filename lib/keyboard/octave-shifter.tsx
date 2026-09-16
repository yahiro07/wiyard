import { cz } from "@lib/utils/cz";
import { seqNumbers } from "@lib/utils/number-helper";

const IndicatorLed = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "w-6 h-6 rounded-full cursor-pointer bd-#444",
        active ? "bg-#9bf" : "bg-#888",
      )}
      onClick={onClick}
    />
  );
};

export const OctaveShifter = ({
  octave,
  setOctave,
}: {
  octave: number;
  setOctave: (octave: number) => void;
}) => {
  return (
    <div className="flex-ha gap-2">
      <div className="flex-ha gap-2">
        {seqNumbers(5).map((k) => {
          const octaveValue = k - 2;
          return (
            <IndicatorLed
              key={k}
              active={octave === octaveValue}
              onClick={() => setOctave(octaveValue)}
            />
          );
        })}
      </div>
    </div>
  );
};
