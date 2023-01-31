const fs = require("fs");
const path = require("path");

(async () => {
    const sharedAttributes = {
        "DeletionPolicy": {
          "description": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html",
          "type": "string",
          "enum": [
            "Delete",
            "Retain",
            "Snapshot"
          ]
        },
        "UpdateReplacePolicy": {
          "description": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html",
          "type": "string",
          "enum": [
            "Delete",
            "Retain",
            "Snapshot"
          ]
        },
        "Metadata": {
          "description": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-metadata.html",
          "type": "object"
        },
        "CreationPolicy": {
          "description": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html",
          "type": "object"
        },
        "UpdatePolicy": {
          "description": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html",
          "type": "object"
        },
        "DependsOn": {
          "type": [
            "string",
            "array"
          ],
          "items": {
            "type": "string"
          }
        }
    }
    /**
     * These resource files are downloaded from cloudformation for us-east-1
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-type-schemas.html
     */
    const resources = fs.readdirSync(path.join(__dirname, "serverless/resources/cloudformation"));
    const resourcesSchema = {
        $comment: "DO NOT EDIT THIS FILE DIRECTLY! PLEASE CHANGE THE INDIVIDUAL RESOURCE FILES AND THEN RUN THE SCRIPT TO GENERATE THIS FILE",
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "https://aws.amazon.com/cloudformation/resources.schema.json",
        definitions: {},
        description: "Auto generated schema from individual resource definition from Cloudformation",
        type: "object",
        properties: {}
    }
    for (const resource of resources) {
        const schema = require(`./serverless/resources/cloudformation/${resource}`);
        resourcesSchema.definitions[schema.typeName.split("::").join("")] = {
            title: schema.typeName.split("::").join(""),
            type: "object",
            additionalProperties: false,
            properties: {
                Type: {
                    type: "string",
                    enum: [
                        schema.typeName
                    ],
                },
                Properties: {
                  $ref: `cloudformation-modified/${resource}`
                },
                ...sharedAttributes
            },
            required: [
              "Type",
              "Properties"
            ]
        }
        schema.title = schema.typeName
        schema.type = "object"
        let {description, sourceUrl} = schema
        if (!description) {
          description = "No description available"
        }
        if (!sourceUrl) {
          sourceUrl = "No source definition found, add manually please"
        }
        schema.description = `${description}. Source:- ${sourceUrl}`
        // remove readonly properties
        if (schema.readOnlyProperties) {
          schema.readOnlyProperties.forEach(rP => {
            const parts = rP.trim().split("/")
            const property = parts[parts.length - 1]
            if (schema.properties[property]) {
              delete schema.properties[property]
            }
          })
        }
        fs.writeFileSync(
            path.join(__dirname, `serverless/resources/cloudformation-modified/${resource}`),
            JSON.stringify(schema, null, 2)
        )
    }
    resourcesSchema.properties = {
        Resources: {
            type: "object",
            minProperties: 1,
            patternProperties: {
                "^[a-zA-Z0-9]{1,255}$": {
                    oneOf: Object.keys(resourcesSchema.definitions).map((d) => {
                        return {
                            $ref: "#/definitions/" + d
                        }
                    })
                }
            }
        }
    }
    fs.writeFileSync(
        path.join(__dirname, "serverless/resources/resources.schema.json"),
        JSON.stringify(resourcesSchema, null, 2)
    )
})()