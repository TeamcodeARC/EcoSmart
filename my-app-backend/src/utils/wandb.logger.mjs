import wandb from '@wandb/sdk';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export class WandbLogger {
  constructor(projectName) {
    this.projectName = projectName;
    this.initialized = false;
  }

  async initWandb() {
    try {
      if (!process.env.WANDB_API_KEY) {
        throw new Error('W&B API Key not found');
      }

      await wandb.init({
        apiKey: process.env.WANDB_API_KEY,
        project: this.projectName,
        entity: "ecosmart",
        mode: "online",
        config: {
          framework: "openai",
          application_type: "resource_management",
          environment: process.env.NODE_ENV,
          model: "gpt-4-turbo-preview"
        }
      });
      this.initialized = true;
      console.log('Successfully initialized Weights & Biases logging');
    } catch (error) {
      console.error('W&B Initialization Error:', error);
      throw error;
    }
  }

  async logAnalysis(data) {
    try {
      if (!this.initialized) {
        console.log('Initializing W&B for analysis logging...');
        await this.initWandb();
      }
      
      await wandb.log({
        'analysis_input': data.input_data,
        'analysis_output': data.output,
        'model_version': data.model_version,
        'timestamp': new Date().toISOString(),
        'event_type': 'analysis',
        'run_id': wandb.run.id
      });
      console.log('Successfully logged analysis to W&B');
    } catch (error) {
      console.error('W&B Logging Error:', error);
      throw error;
    }
  }

  async logPrediction(data) {
    try {
      if (!this.initialized) {
        await this.initWandb();
      }

      // Skip logging if initialization failed
      if (!this.initialized) {
        console.warn('W&B logging disabled. Prediction will not be logged.');
        return;
      }

      await wandb.log({
        'historical_data': data.historical_data,
        'prediction': data.prediction,
        'model_version': data.model_version,
        'timestamp': new Date().toISOString(),
        'event_type': 'prediction'
      });
    } catch (error) {
      console.error('W&B Logging Error:', error);
    }
  }

  async finishRun() {
    try {
      if (this.initialized && wandb.run) {
        await wandb.finish();
      }
    } catch (error) {
      console.error('W&B Finish Error:', error);
    }
  }
}