const ImageNotDefinedError = {
  status: "error",
  errors: [
    {
      error: "IMAGE_NOT_DEFINED",
      msg: "Изображение не загружено.",
    },
  ],
};

const MultipleImageError = {
  status: "error",
  errors: [
    {
      error: "MULTIPLE_IMAGE_NOT_SUPPORTED",
      msg: "Загрузка нескольких изображений не поддерживается",
    },
  ],
};

const FileFormatError = {
  status: "error",
  errors: [
    {
      error: "FILE_FORMAT_ERROR",
      msg: "Загруженный файл не является изображением",
    },
  ],
};

const UnsupportedImageFormatError = {
  status: "error",
  errors: [
    {
      error: "UNSUPPORTED_IMAGE_FORMAT",
      msg: "Неподдерживаемый формат изображения",
    },
  ],
};

const InternalServerError = {
  status: "error",
  errors: [
    {
      error: "INTERNAL_ERROR",
      msg: "Внутренняя ошибка сервера",
    },
  ],
};

const ImageProcessError = {
  status: "error",
  errors: [
    {
      error: "IMAGE_PROCESSING_ERROR",
      msg: "Не удалось обработать изображение",
    },
  ],
};

const InvalidJSONError = {
  status: "error",
  errors: {
    error: "INVALID_JSON",
    msg: "Неверный формат входных данных",
  },
};

const XLSXCreateError = {
  status: "error",
  errors: {
    error: "XLSX_CREATE_ERROR",
    msg: "Не удалось создать таблицу",
  },
};

const WriteFileError = {
  status: "error",
  errors: {
    error: "WRITE_FILE_ERROR",
    msg: "Не удалось записать файл",
  },
};

module.exports = {
  ImageNotDefinedError,
  MultipleImageError,
  FileFormatError,
  UnsupportedImageFormatError,
  InternalServerError,
  ImageProcessError,
  InvalidJSONError,
  XLSXCreateError,
  WriteFileError,
};
