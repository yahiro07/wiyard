import { ReactUnitFrame } from "wafer-host/react";
import { windowIds } from "@/domain/types";
import { interUnitFactories } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { WindowFrame } from "@lib/window-system";
import { ScalerBoxDW } from "@lib/components/headless/scaler-box-d";
import { automationChannelGetters } from "@/store/automation-channel-getters";
import { channelListColumnComponents } from "@/views/window/components/channel-list-column";

const ChannelListColumn = () => {
  const { currentAutomationChannelId } = store.useSnapshot();
  const channelIds = automationChannelGetters.useAutomationChannelIds();
  const canAdd = channelIds.length < 4;
  const canDelete = channelIds.length > 0;

  const handleRemove = () => {
    const ok = window.confirm(`are you sure to remove the automation channel?`);
    if (ok) {
      actions.removeCurrentAutomationChannel();
    }
  };
  const { ColumnFrame, ChannelButton, AddButton, DeleteButton } =
    channelListColumnComponents;
  return (
    <ColumnFrame>
      {channelIds.map((id, index) => (
        <ChannelButton
          key={id}
          text={`${index + 1}`}
          active={id === currentAutomationChannelId}
          onClick={() => actions.selectAutomationChannel(id)}
        />
      ))}
      {canAdd && <AddButton onClick={actions.addAutomationEditorUnit} />}
      <div className="grow" />
      {canDelete && <DeleteButton onClick={handleRemove} />}
    </ColumnFrame>
  );
};

// const SequencerUnitItemView = ({
//   notePortUnitItem,
// }: {
//   notePortUnitItem: NoteInputPortUnitItem;
// }) => {
//   const { currentNoteChannelId } = store.useSnapshot();
//   const displayed = notePortUnitItem.unitId === currentNoteChannelId;
//   const internalUnitFactory =
//     interUnitFactories[notePortUnitItem.sequencerClassKey as InternalUnitKey];
//   const catalogItem = catalog[notePortUnitItem.sequencerClassKey as CatalogKey];
//   const sequencerUnitId = notePortGetters.getSequencerUnitId(
//     notePortUnitItem.unitId,
//   );
//   let content: ReactNode;
//   if (internalUnitFactory) {
//     content = (
//       <ReactUnitFrame
//         unitId={sequencerUnitId}
//         unitTemplateFn={internalUnitFactory}
//       />
//     );
//   } else if (catalogItem) {
//     content = (
//       <UnitFrameScaled
//         unitId={sequencerUnitId}
//         unitUrl={catalogItem.loaderPageUrl}
//       />
//     );
//   }
//   return (
//     <div className={cz("absolute-full", !displayed && "invisible")}>
//       {content}
//     </div>
//   );
// };

const EditorContentSection = () => {
  // const unitItems = notePortGetters.useNoteInputPortUnitItems();
  return (
    <div className="flex-grow relative overflow-hidden">
      {/* {unitItems.map((item) => (
        <SequencerUnitItemView key={item.unitId} notePortUnitItem={item} />
      ))} */}
      <ReactUnitFrame
        unitId={"automationEditor1"}
        unitTemplateFn={interUnitFactories.automationEditor}
      />
    </div>
  );
};

export const AutomationEditorWindow = () => {
  return (
    <WindowFrame id={windowIds.automationEditor} title="automation editor">
      <ScalerBoxDW designWidth={1100} scaleDirection="lower">
        <div className="h-full flex-h">
          <ChannelListColumn />
          <EditorContentSection />
        </div>
      </ScalerBoxDW>
    </WindowFrame>
  );
};
