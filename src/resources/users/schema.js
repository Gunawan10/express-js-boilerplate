module.exports = {
  bodyCreate: {
    name: {
      type: "string",
      required: true,
      min: 3,
      max: 100,
      trim: true
    },
    email: {
      type: "string",
      format: "email",
      required: true,
      lowercase: true
    },
    password: {
      type: "string",
      format: "password",
      required: true,
      min: 8
    },
    age: {
      type: "integer",
      min: 17,
      max: 100
    },
    is_active: {
      type: "boolean",
      default: true
    },
    role: {
      type: "string",
      format: "enum",
      values: ["admin", "staff", "member"],
      required: true
    },
    profile: {
      type: "object",
      required: true,
      schema: {
        phone: {
          type: "string",
          format: "phone"
        },
        birth_date: {
          type: "string",
          format: "date"
        },
        address: {
          type: "object",
          required: true,
          schema: {
            province: {
              type: "string",
              required: true
            },
            city: {
              type: "string",
              required: true
            },
            district: {
              type: "string"
            },
            postal_code: {
              type: "string"
            }
          }
        }
      }
    },
    skills: {
      type: "array",
      min: 1,
      items: {
        type: "string"
      }
    },
    educations: {
      type: "array",
      items: {
        type: "object",
        schema: {
          school: {
            type: "string",
            required: true
          },
          degree: {
            type: "string"
          },
          year: {
            type: "integer",
            required: true
          }
        }
      }
    }
  },
  bodyUpdate: {
    name: {
      type: "string",
      min: 3,
      max: 100,
      trim: true
    },
    email: {
      type: "string",
      format: "email",
      lowercase: true
    },
    age: {
      type: "integer",
      min: 17,
      max: 100
    },
    is_active: {
      type: "boolean"
    },
    role: {
      type: "string",
      format: "enum",
      values: ["admin", "staff", "member"]
    },
    profile: {
      type: "object",
      schema: {
        phone: {
          type: "string",
          format: "phone"
        },
        birth_date: {
          type: "string",
          format: "date"
        },
        address: {
          type: "object",
          schema: {
            province: {
              type: "string"
            },
            city: {
              type: "string"
            },
            district: {
              type: "string"
            },
            postal_code: {
              type: "string"
            }
          }
        }
      }
    },
    skills: {
      type: "array",
      items: {
        type: "string"
      }
    },
    educations: {
      type: "array",
      items: {
        type: "object",
        schema: {
          school: {
            type: "string"
          },
          degree: {
            type: "string"
          },
          year: {
            type: "integer"
          }
        }
      }
    }
  },
  queryList: {
    page: {
      type: "integer",
      default: 1
    },
    limit: {
      type: "integer",
      default: 10,
      max: 100
    },
    search: {
      type: "string",
      trim: true
    },
    role: {
      type: "string",
      format: "enum",
      values: ["admin", "staff", "member"]
    },
    is_active: {
      type: "boolean"
    }
  },
  paramUser: {
    user_id: {
      type: "string",
      format: "uuid",
      required: true
    }
  }
}