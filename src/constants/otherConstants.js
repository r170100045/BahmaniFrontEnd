export const EXAMPLE_ENTRIES = ["Bihar", "Araria", "Bhargama", "Baija Patti"];

export const FORMAT_OPTIONS = [
  { label: "java.lang.Boolean", value: "java.lang.Boolean" },
  { label: "java.lang.Character", value: "java.lang.Character" },
  { label: "java.lang.Float", value: "java.lang.Float" },
  { label: "java.lang.Integer", value: "java.lang.Integer" },
  { label: "java.lang.String", value: "java.lang.String" },
  { label: "java.openmrs.Concept", value: "java.openmrs.Concept" },
  { label: "java.openmrs.Drug", value: "java.openmrs.Drug" },
  { label: "java.openmrs.Encounter", value: "java.openmrs.Encounter" },
  { label: "java.openmrs.Location", value: "java.openmrs.Location" },
  { label: "java.openmrs.Patient", value: "java.openmrs.Patient" },
  { label: "java.openmrs.Person", value: "java.openmrs.Person" },
  {
    label: "java.openmrs.ProgramWorkflow",
    value: "java.openmrs.ProgramWorkflow",
  },
  { label: "java.openmrs.Provlabeler", value: "java.openmrs.Provlabeler" },
  { label: "java.openmrs.User", value: "java.openmrs.User" },
  {
    label: "java.openmrs.util.AttributableDate",
    value: "java.openmrs.util.AttributableDate",
  },
];

export const CONCEPT_COMPLEX_HANDLERS = [
  { value: "ImageHandler", label: "ImageHandler" },
  { value: "TextHandler", label: "TextHandler" },
  { value: "BinaryDataHandler", label: "BinaryDataHandler" },
  { value: "BinaryStreamHandler", label: "BinaryStreamHandler" },
  { value: "ImageUrlHandler", label: "ImageUrlHandler" },
  { value: "VideoUrlHandler", label: "VideoUrlHandler" },
  { value: "LocationObsHandler", label: "LocationObsHandler" },
  { value: "ProviderObsHandler", label: "ProviderObsHandler" },
  { value: "MediaHandler", label: "MediaHandler" },
];

export const GET_VALUE = (field) => {
  return field === null ? "" : field;
};

export const FILTER_OPTIONS = (option, inputValue) => {
  const { label, value } = option;
  return (
    (label != null && label.toLowerCase().includes(inputValue.toLowerCase())) ||
    value.toString().toLowerCase().includes(inputValue.toLowerCase())
  );
};
