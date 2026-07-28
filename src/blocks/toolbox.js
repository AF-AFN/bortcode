export const toolboxXML = `
<xml id="toolbox" style="display: none">
  <category name="Screen" colour="160">
    <block type="bart_put"></block>
    <block type="bart_clear"></block>
  </category>
  <category name="Control" colour="120">
    <block type="bart_wait">
      <value name="SECONDS">
        <block type="bart_number">
          <field name="VALUE">1</field>
        </block>
      </value>
    </block>
  </category>
  <category name="Operators" colour="230">
    <block type="bart_string"></block>
    <block type="bart_number"></block>
    <block type="bart_join"></block>
  </category>
</xml>
`;